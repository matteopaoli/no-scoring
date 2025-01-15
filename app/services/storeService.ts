import { stores, users, userStoreRoles } from "schema";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { UserService } from "./userService";
export class Store {
    static getById(storeId: string) {
        return db.select().from(stores).where(eq(stores.id, storeId));
    }
    static async updateStatus(storeId: string, value: boolean) {
        return db.update(stores).set({ isSubscriptionActive: value }).where(eq(stores.id, storeId)).returning()
    }
    static async getAdminUser(storeId: string) {
        const [{ id }] = await db.select({ id: users.id }).from(users).innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id)).where(and(eq(userStoreRoles.storeId, storeId), eq(userStoreRoles.role, 'admin')));
        if (id) return await UserService.getUserById(id);
    }
    static async getStripeUserId(storeId: string) {
        const adminUser = await this.getAdminUser(storeId);
        if (!adminUser?.stripeUserId) throw new Error();
        return adminUser.stripeUserId;
    }
}