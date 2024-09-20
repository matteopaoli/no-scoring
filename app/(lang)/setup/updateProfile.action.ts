"use server";

import { z } from "zod";
import { updateProfile } from "@/app/db";

// Definiamo lo schema di validazione con Zod
const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  profileImage: z.instanceof(Blob).optional(), // L'immagine è opzionale
  email: z.string()
  .min(1, "Inserire un indirizzo email valido")
  .email("Inserire un indirizzo email valido") // Add email format validation
});

export async function updateProfileAction(prevState: unknown, formData: FormData) {
  // Convertiamo i dati del form in un oggetto leggibile
  const profileData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    profileImage: formData.get('profileImage') as Blob | null,
    email: formData.get('email') as string
  };

  // Validiamo i dati del profilo
  const validation = updateProfileSchema.safeParse(profileData);
  if (!validation.success) {
    return JSON.stringify(validation.error.format()); // Restituiamo gli errori di validazione
  }

  const { firstName, lastName, profileImage, email } = validation.data;

  // Salviamo i dati nel database
  await updateProfile({ firstName, lastName, profileImage, email });

  return { success: true };
}
