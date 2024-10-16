"use server";

import { z } from "zod";
import { updateProfile } from "@/app/db";

// Definiamo lo schema di validazione con Zod
const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  profileImage: z.instanceof(Blob).optional(),
  email: z.string()
  .min(1, "Inserire un indirizzo email valido")
  .email("Inserire un indirizzo email valido")
});

export async function updateProfileAction(prevState: unknown, formData: FormData) {
  const profileData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    profileImage: formData.get('profileImage') as Blob | null,
    email: formData.get('email') as string
  };

  const validation = updateProfileSchema.safeParse(profileData);
  if (!validation.success) {
    return JSON.stringify(validation.error.format());
  }

  const { firstName, lastName, profileImage, email } = validation.data;

  await updateProfile({ firstName, lastName, profileImage, email });

  return { success: true };
}
