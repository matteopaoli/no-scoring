"use server";

import { db, getStoreByUserId } from "@/app/db";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { stores } from "@paytomorrow/db";
import { eq } from "drizzle-orm";

export async function updateStoreFeesAction(
  prevState: unknown,
  value: boolean
): FormActionReturnTypeWithStatus {
  const user = await getUserFromAuth();
  const store = await getStoreByUserId(user.id);

  console.log("store", store.id);
  console.log("value", value);

  try {
    const result = await db
      .update(stores)
      .set({ customerPaysFees: value })
      .where(eq(stores.id, store.id))
      .returning();

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Error updating store fees:", error);
    return {
      status: "error",
    };
  }
}
