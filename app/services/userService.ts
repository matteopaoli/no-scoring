import { users } from "schema";
import { db, User } from "../db";
import { eq } from "drizzle-orm";
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
}
