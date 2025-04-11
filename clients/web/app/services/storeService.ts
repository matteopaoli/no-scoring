import { stores, users, userStoreRoles, db } from "@paytomorrow/db";
import { and, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { UserService } from "./userService";
export class Store {
  static getById(storeId: string) {
    return db.select().from(stores).where(eq(stores.id, storeId));
  }
  static async updateStatus(storeId: string, value: boolean) {
    return db
      .update(stores)
      .set({ isSubscriptionActive: value })
      .where(eq(stores.id, storeId))
      .returning();
  }
  static async getAdminUser(storeId: string) {
    const [{ id }] = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id))
      .where(
        and(
          eq(userStoreRoles.storeId, storeId),
          eq(userStoreRoles.role, "admin")
        )
      );
    if (id) return await UserService.getUserById(id);
  }
  static async getStripeUserId(storeId: string) {
    const adminUser = await this.getAdminUser(storeId);
    if (!adminUser?.stripeUserId) throw new Error();
    return adminUser.stripeUserId;
  }

  static async getStores(ids: string[], userId?: string) {
    return db
      .select({
        ...getTableColumns(stores), // Selects all fields from the stores table
        partnerName: userId
          ? sql<string>`CASE 
                    WHEN ${stores.partnerId} = ${userId} 
                    THEN CONCAT(${users.firstName}, ' ', ${users.lastName}, ' (Tu)') 
                    ELSE CONCAT(${users.firstName}, ' ', ${users.lastName}) 
                  END`
          : sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        ownedBy: sql<string>`(
                SELECT CONCAT("u"."firstName", ' ', "u"."lastName")
                FROM "userStoreRole" "usr"
                JOIN public."user" "u" ON "u"."id" = "usr"."userId"
                WHERE "usr"."storeId" = ${stores.id} AND "usr"."role" = 'admin'
                LIMIT 1
              )`,
      })
      .from(stores)
      .leftJoin(users, eq(users.id, stores.partnerId))
      .where(inArray(stores.id, ids));
  }

  static async getStoreByUserId(userId: string) {
    const result = await db
      .select({
        id: stores.id,
        name: stores.name,
        partnerId: stores.partnerId,
        customerPaysFees: stores.customerPaysFees,
        address: stores.address,
        location: stores.location,
        geodata: stores.geodata,
      })
      .from(stores)
      .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
      .where(eq(userStoreRoles.userId, userId));
    return result[0] || null;
  }
}
