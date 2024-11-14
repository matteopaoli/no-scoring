"use server";

import { z } from "zod";
import { updateProfile } from "@/app/db";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

// Definiamo lo schema di validazione con Zod
const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Il nome è obbligatorio"),
  lastName: z.string().trim().min(1, "Il cognome è obbligatorio"),
  profileImage: z.instanceof(Blob).optional(),
  email: z.string()
  .min(1, "Inserire un indirizzo email valido")
  .email("Inserire un indirizzo email valido")
});

export async function updateProfileAction(prevState: Awaited<FormActionReturnType>, formData: FormData): FormActionReturnType {
  const user = await getUserFromAuth();
  const profileData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    profileImage: formData.get('profileImage') as Blob | null,
    email: user.email
  };

  const validation = updateProfileSchema.safeParse(profileData);
  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, profileImage, email } = validation.data;

  await updateProfile({ firstName, lastName, profileImage, email });

  return [];
}
