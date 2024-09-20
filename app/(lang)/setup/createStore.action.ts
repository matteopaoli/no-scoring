"use server";

import { z } from "zod";
import { completeOnboarding, createStore } from "@/app/db"; // Assumiamo che esista una funzione per creare il negozio
import { redirect } from "next/navigation";

// Definiamo lo schema di validazione per la creazione del negozio
const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.instanceof(Blob).optional(), // Il logo del negozio è opzionale
  email: z.string()
    .min(1, "Inserire un indirizzo email valido")
    .email("Inserire un indirizzo email valido") // Validazione formato email
});

export async function createStoreAction(prevState: unknown, formData: FormData) {
  // Convertiamo i dati del form in un oggetto leggibile
  const storeData = {
    storeName: formData.get('storeName') as string,
    storeLogo: formData.get('storeLogo') as Blob | null,
    email: formData.get('email') as string
  };

  // Validiamo i dati del negozio
  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return JSON.stringify(validation.error.format()); // Restituiamo gli errori di validazione
  }

  const { storeName, storeLogo, email } = validation.data;

  // Salviamo i dati del negozio nel database
  await createStore({ storeName, storeLogo, email });
  await completeOnboarding(email)

  redirect('/app')
}
