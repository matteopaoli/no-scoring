"use server";

import { z } from "zod";
import {
  completeOnboarding,
  createStore,
  getStoreByUserId,
  getUser,
  updateStore,
} from "@/app/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";

const MAX_FILE_SIZE = 5000000;

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.union([z.instanceof(Blob), z.undefined()]).refine((file) => (file?.size ?? 0) <= MAX_FILE_SIZE, `L'immagine non puó superare i 5MB.`)
});

export async function updateStoreAction(
  prevState: unknown,
  formData: FormData
): FormActionReturnType {
  const session = await auth();
  const user = await getUser(session?.user?.email);
  const store = await getStoreByUserId(user.id);
  const storeData = {
    storeName: formData.get("storeName") as string,
    storeLogo: formData.get("storeLogo") ?? undefined as Blob | undefined,
  };
  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { storeName, storeLogo } = validation.data;

  const updateData = {
    storeName,
    storeLogo,
  };

  await updateStore(store.id, updateData);

  redirect("/app?success=true&action=updateStore");
}
