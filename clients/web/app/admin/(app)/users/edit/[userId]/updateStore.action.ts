"use server";

import { z } from "zod";
import { stores, db } from "@paytomorrow/db"; // adjust path if needed
import { eq, sql } from "drizzle-orm";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { redirect } from "next/navigation";

const updateStoreSchema = z.object({
  storeId: z.string().uuid("ID negozio non valido"),
  address: z.string().min(1, "Indirizzo obbligatorio"),
  lat: z.number(),
  lng: z.number(),
  placeId: z.string().min(1),
});

export default async function updateStoreAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const validation = await updateStoreSchema.safeParseAsync({
    storeId: formData.get("storeId"),
    address: formData.get("address"),
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
    placeId: formData.get("placeId"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { storeId, address, lat, lng, placeId } = validation.data;

  await db
    .update(stores)
    .set({
      address,
      location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)` as any,
      geodata: {
        lat,
        lng,
        placeId,
      },
    })
    .where(eq(stores.id, storeId));

  redirect("/admin/users?success=true&action=update");
}
