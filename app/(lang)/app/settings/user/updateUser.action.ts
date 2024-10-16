"use server";

import { z } from "zod";
import { getUser, updateProfile } from "@/app/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { compressProfileImageToBase64 } from "@/app/utils/images";

export default async function updateUserAction(prevState, formData: FormData): FormActionReturnType {
  const MAX_FILE_SIZE = 5000000;
  const updateUserSchema = z.object({
    firstName: z.string().min(1, "Inserisci il nome"),
    lastName: z.string().min(1, "Inserisci il cognome"),
    image: z.instanceof(Blob).optional().refine((file) => file?.size ?? 0 <= MAX_FILE_SIZE, `L'immagine non puó superare i 5MB.`),
    password: z
      .union([z.string().min(8, "La password deve essere lunga almeno 8 caratteri"), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e)
      .refine(value => {
        if (value === undefined) return true;
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
        if (value === undefined) return true;
        return /(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value) &&
               /(?=.*[0-9])/.test(value) && /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value);
      }, {
        message: "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un simbolo speciale"
      }),
  }).refine((data) => {
    if (data.password || data.repeatPassword) {
      return data.password === data.repeatPassword;
    }
    return true;
  }, {
    message: "Le password non corrispondono",
    path: ["repeatPassword"],
  });

  const validation = updateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
    image: formData.get("image")
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, password, image } = validation.data;
  const session = await auth();
  const user = await getUser(session.user.email)
  if (!user?.email) {
    redirect("/login");
  }

  const updateData: { email: string; firstName: string; lastName: string; password?: string } = {
    email: user.email,
    firstName,
    lastName,
    ...(image? { profileImage: image } : {}),
    ...(password? { password } : {})
  };
 
  await updateProfile(updateData);
  if (user.role === 'admin') {
    redirect('/admin?success=true"')
  }

  redirect("/app?success=true");
}
