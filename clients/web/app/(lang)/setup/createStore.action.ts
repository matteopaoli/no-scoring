"use server";

import { z } from "zod";
import { completeOnboarding, createStore } from "@/app/db";
import { redirect } from "next/navigation";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import Stripe from "stripe";

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Il nome del negozio è obbligatorio"),
  storeLogo: z.instanceof(Blob).nullable(),
  storeAddress_address: z.string().min(1, "Indirizzo obbligatorio"),
  storeAddress_lat: z.number(),
  storeAddress_lng: z.number(),
  storeAddress_placeId: z.string().min(1, "Inserire un indirizzo valido"),
});

export async function createStoreAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const user = await getUserFromAuth();
  const storeData = {
    storeName: formData.get("storeName") as string,
    storeLogo: formData.get("storeLogo") as Blob | null,
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

  await createStore({
    storeName,
    storeLogo,
    userId: user.id,
    address: storeAddress_address,
    lat: storeAddress_lat,
    lng: storeAddress_lng,
    placeId: storeAddress_placeId,
  });
  await completeOnboarding(user.email);

  redirect("/app");
}
