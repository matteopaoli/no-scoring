import { stores } from "schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
export class Store {
    static async updateStatus(storeId: string, value: boolean) {
        return db.update(stores).set({ isSubscriptionActive: value }).where(eq(stores.id, storeId)).returning()
    }
}