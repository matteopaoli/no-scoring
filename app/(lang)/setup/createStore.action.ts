"use server";

import { z } from "zod";
import { completeOnboarding, createStore, getUser } from "@/app/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.instanceof(Blob).optional(),
});

export async function createStoreAction(prevState: Awaited<FormActionReturnType>, formData: FormData): FormActionReturnType {
  const session = await auth()
  const user = await getUser(session?.user?.email)
  const storeData = {
    storeName: formData.get('storeName') as string,
    storeLogo: formData.get('storeLogo') as Blob | null,
  };

  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return formatZodErrors(validation)
  }

  const { storeName, storeLogo } = validation.data;

  await createStore({ storeName, storeLogo, userId: user.id });
  await completeOnboarding(user.email)

  redirect('/app')
}
