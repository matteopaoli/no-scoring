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
});

export async function createStoreAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const user = await getUserFromAuth();
  const storeData = {
    storeName: formData.get("storeName") as string,
    storeLogo: formData.get("storeLogo") as Blob | null,
  };

  const validation = createStoreSchema.safeParse(storeData);
  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { storeName, storeLogo } = validation.data;

  await createStore({ storeName, storeLogo, userId: user.id });
  await completeOnboarding(user.email);

  redirect("/app");
}
