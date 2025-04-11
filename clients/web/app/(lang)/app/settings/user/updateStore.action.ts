"use server";

import { z } from "zod";
import {
  completeOnboarding,
  createStore,
  getStoreByUserId,
  updateStore,
} from "@/app/db";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

const MAX_FILE_SIZE = 5000000;

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z
    .union([z.instanceof(Blob), z.undefined()])
    .refine(
      (file) => (file?.size ?? 0) <= MAX_FILE_SIZE,
      `L'immagine non puó superare i 5MB.`
    ),
  storeAddress_address: z.string().min(1, "Indirizzo obbligatorio"),
  storeAddress_lat: z.number(),
  storeAddress_lng: z.number(),
  storeAddress_placeId: z.string(),
});

export async function updateStoreAction(
  prevState: unknown,
  formData: FormData
): FormActionReturnType {
  const user = await getUserFromAuth();
  const store = await getStoreByUserId(user.id);
  const storeData = {
    storeName: formData.get("storeName") as string,
    storeLogo: formData.get("storeLogo") ?? (undefined as Blob | undefined),
    storeAddress_address: formData.get("storeAddress_address") as string,
    storeAddress_lat: Number(formData.get("storeAddress_lat")),
    storeAddress_lng: Number(formData.get("storeAddress_lng")),
    storeAddress_placeId: formData.get("storeAddress_placeId") as string,
  };
  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const {
    storeName,
    storeLogo,
    storeAddress_address,
    storeAddress_lat,
    storeAddress_lng,
    storeAddress_placeId,
  } = validation.data;

  const updateData = {
    storeName,
    storeLogo,
    address: storeAddress_address,
    lat: storeAddress_lat,
    lng : storeAddress_lng,
    placeId: storeAddress_placeId,
  };

  await updateStore(store.id, updateData);

  redirect("/app?success=true&action=updateStore");
}
