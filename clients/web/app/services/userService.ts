import { stores, users, userStoreRoles } from "schema";
import { db, User } from "../db";
import { and, eq, getTableColumns } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { Store } from "./storeService";

export class UserService {
  private static async checkAdminAuthorization(userId: string, posId: string) {
    try {
      const [user, pos] = await Promise.all([
        UserService.getUserById(userId),
        UserService.getUserById(posId),
      ]);
  
      if (!user) {
        throw { field: "server", message: "User not authenticated" };
      }
      if (!pos) {
        throw { field: "server", message: "Point of sale not found" };
      }
  
      const [userRoles, posRoles] = await Promise.all([
        UserService.getStoreRoles(user as unknown as User),
        UserService.getStoreRoles(pos as unknown as User),
      ]);
  
      const posStoreId = posRoles[0]?.storeId;
      if (!posStoreId) {
        throw { field: "server", message: "Point of sale store ID not found" };
      }
  
      const isAdmin = userRoles.some(
        (role) => role.storeId === posStoreId && role.role === "admin"
      );
      if (!isAdmin) {
        throw { field: "server", message: "Unauthorized" };
      }
  
      return { success: true };
    } catch (error) {
      return { errors: [error] };
    }
  }
  
  static async getUserByEmail(email: string) {
    return (
      await db
        .select()
        .from(users)
        .where(eq(users.email, email ?? ""))
    )?.[0] as User | undefined;
  }

  static async getUserById(id: string) {
    const { password, image, ...nonPwCols } = getTableColumns(users);
    return (await db.select(nonPwCols).from(users).where(eq(users.id, id)))?.[0];
  }

  static getDefaultPassword() {
    const salt = genSaltSync(10);
    const hash = hashSync("PayTomorrow!2024", salt);
    return hash;
  }

  static generatePassword() {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
    const passwordArray = new Uint32Array(16);
    crypto.getRandomValues(passwordArray);
    let password = "";
    passwordArray.forEach((value) => {
      password += charset[value % charset.length];
    });
    return password;
  }

  static isPartner(user: { role?: string | null }) {
    const partnerRoles = ["partner", "subpartner"];
    return user?.role ? partnerRoles.includes(user.role) : false;
  }

  static isAdmin(user: { role?: string | null }) {
    return user?.role ? user.role === "admin" : false;
  }

  static async getStores(user: User) {
    return await db
      .select({ ...getTableColumns(stores) })
      .from(stores)
      .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
      .innerJoin(users, eq(userStoreRoles.userId, users.id))
      .where(eq(users.id, user.id));
  }

  static async createPOS(name: string, storeId: string, email?: string) {
    return await db.transaction(async (tx) => {
      if (!email) {
        email = await this.generatePosEmail(storeId);
      }
      const salt = genSaltSync(10);
      const hash = hashSync(this.generatePassword(), salt);
  
      const [pos] = await tx.insert(users).values({
        role: "pos",
        email,
        refName: name,
        onboardingCompleted: true,
        tosAccepted: true,
        tosAcceptedAt: new Date(),
        leadStatus: null,
        status: "active",
        password: hash,
      }).returning();
  
      const [rule] = await tx.insert(userStoreRoles).values({
        storeId,
        userId: pos.id,
        role: "pos",
      }).returning();
  
      if (pos && rule) {
        return pos;
      } else {
        throw new Error("Failed to create POS user and assign role.");
      }
    });
  }
  
  
  static async getAllPos(storeId: string) {
    return await db
    .select({ email: users.email, name: users.refName, id: users.id })
    .from(users)
    .innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id))
    .where(and(eq(userStoreRoles.storeId, storeId), eq(userStoreRoles.role, 'pos')));  
  }

  static async deletePos(posId: string, userId: string) {
    console.log(posId, userId);
    await UserService.checkAdminAuthorization(userId, posId);
    await db.delete(userStoreRoles).where(eq(userStoreRoles.userId, posId));
    await db.delete(users).where(eq(users.id, posId));
  }

  static async generatePosEmail(storeId: string) {
    const store = (await Store.getById(storeId))?.[0];
    if (!store) {
      throw new Error('Store not found');
    }
    const pos = await this.getAllPos(storeId);
    let maxIndex = 0;
    pos.forEach(({email}) => {
      const emailIndex = parseInt(email.split('_')[1].split('@')[0], 10);
      if (emailIndex > maxIndex) {
        maxIndex = emailIndex;
      }
    });

    return `pos${store.id}_${maxIndex + 1}@paytomorrow.app`
  }

  static async saveMagicLink(userId: string, magicLinkUrl: string) {
    return db.update(users).set({ magicLinkUrl }).where(eq(users.id, userId))
  }

  static async getStoreRoles(user: User) {
    return db.select().from(userStoreRoles).where(eq(userStoreRoles.userId, user.id))
  }
}
