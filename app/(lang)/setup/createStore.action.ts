"use server";

import { z } from "zod";
import { completeOnboarding, createStore, getUser } from "@/app/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.instanceof(Blob).optional(),
});

export async function createStoreAction(prevState: unknown, formData: FormData) {
  const session = await auth()
  const user = await getUser(session?.user?.email)
  const storeData = {
    storeName: formData.get('storeName') as string,
    storeLogo: formData.get('storeLogo') as Blob | null,
  };

  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return JSON.stringify(validation.error.format());
  }

  const { storeName, storeLogo } = validation.data;

  await createStore({ storeName, storeLogo, email: user.email });
  await completeOnboarding(user.email)

  redirect('/app')
}
