"use server";

import { z } from "zod";
import { updateProfile } from "@/app/db"; // Assumed update user method
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";

export default async function updateUserAction(prevState, formData: FormData): FormActionReturnType {
  // Define Zod schema for form validation
  const updateUserSchema = z.object({
    firstName: z.string().min(1, "Inserisci il nome"),
    lastName: z.string().min(1, "Inserisci il cognome"),
    password: z
      .union([z.string().min(8, "La password deve essere lunga almeno 8 caratteri"), z.string().length(0)]) // Use union for optional passwords
      .optional()
      .transform(e => e === "" ? undefined : e) // Transform empty string to undefined
      .refine(value => {
        if (value === undefined) return true; // If no password is provided, skip validation
        return /(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value) &&
               /(?=.*[0-9])/.test(value) && /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value);
      }, {
        message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un simbolo speciale"
      }),
    repeatPassword: z
      .union([z.string().min(8, "La password deve essere lunga almeno 8 caratteri"), z.string().length(0)]) // Same for repeatPassword
      .optional()
      .transform(e => e === "" ? undefined : e)
      .refine(value => {
        if (value === undefined) return true; // If no password is provided, skip validation
        return /(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value) &&
               /(?=.*[0-9])/.test(value) && /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value);
      }, {
        message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un simbolo speciale"
      }),
  }).refine((data) => {
    // Check if password is provided and matches repeatPassword if present
    if (data.password || data.repeatPassword) {
      return data.password === data.repeatPassword;
    }
    return true; // If neither password field is present, return true
  }, {
    message: "Le password non corrispondono",
    path: ["repeatPassword"], // Apply this error to repeatPassword field
  });

  // Validate the form data
  const validation = updateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, password } = validation.data;

  // Update the user (retrieved via the session)
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Prepare update payload, only include password if provided
  const updateData: { email: string; firstName: string; lastName: string; password?: string } = {
    email: session.user.email,
    firstName: firstName as string,
    lastName: lastName as string,
  };

  if (password) {
    updateData.password = password as string; // Only add password if it exists
  }

  await updateProfile(updateData);

  redirect("/app?success=true"); // Redirect after successful update
}
