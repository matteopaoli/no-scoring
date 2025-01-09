import { stores, users, userStoreRoles } from "schema";
import { db, User } from "../db";
import { eq, getTableColumns } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";

export class UserService {
  static async getUserByEmail(email: string) {
    return (
      await db
        .select()
        .from(users)
        .where(eq(users.email, email ?? ""))
    )?.[0] as User;
  }

  static async getUserById(id: string) {
    return (await db.select().from(users).where(eq(users.id, id)))?.[0] as User;
  }

  static getDefaultPassword() {
    const salt = genSaltSync(10);
    const hash = hashSync("PayTomorrow!2024", salt);
    return hash;
  };

  static isPartner(user: { role?: string | null }) {
    const partnerRoles = ['partner', 'subpartner']
    return user?.role ? partnerRoles.includes(user.role) : false
  }

  static isAdmin(user: { role?: string | null }) {
    return user?.role ? user.role === 'admin' : false
  }

  static async getStores(user: User) {
    return (await db.select({ ...getTableColumns(stores) }).from(stores).innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId)).innerJoin(users, eq(userStoreRoles.userId, users.id)).where(eq(users.id, user.id)))
  } 
}
