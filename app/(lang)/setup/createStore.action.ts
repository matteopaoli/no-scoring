"use server";

import { z } from "zod";
import { completeOnboarding, createStore, getUser } from "@/app/db"; // Assumiamo che esista una funzione per creare il negozio
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/app/auth";

// Definiamo lo schema di validazione per la creazione del negozio
const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.instanceof(Blob).optional(), // Il logo del negozio è opzionale
});

export async function createStoreAction(prevState: unknown, formData: FormData) {
  const session = await auth()
  const user = await getUser(session?.user?.email)
  // Convertiamo i dati del form in un oggetto leggibile
  const storeData = {
    storeName: formData.get('storeName') as string,
    storeLogo: formData.get('storeLogo') as Blob | null,
  };

  // Validiamo i dati del negozio
  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return JSON.stringify(validation.error.format()); // Restituiamo gli errori di validazione
  }

  const { storeName, storeLogo } = validation.data;

  // Salviamo i dati del negozio nel database
  await createStore({ storeName, storeLogo, email: user.email });
  await completeOnboarding(user.email)

  redirect('/app')
}
