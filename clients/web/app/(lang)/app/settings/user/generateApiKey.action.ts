"use server";

import { getStoreByUserId } from "@/app/db";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { db, stores, users } from "@paytomorrow/db";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export async function generateApiKeyAction() {
  console.log('a')
  const user = await getUserFromAuth();
  console.log('b')
  const store = await getStoreByUserId(user.id);
  console.log(user.id)
  if (!store) {
    throw new Error("Store not found");
  }
  const newApiKey = randomBytes(32).toString("hex");

  await db
    .update(stores)
    .set({ apiKey: newApiKey })
    .where(eq(stores.id, store.id));
  return { apiKey: newApiKey };
}
