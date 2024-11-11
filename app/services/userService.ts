import { users } from "schema";
import { db, User } from "../db";
import { eq } from "drizzle-orm";

export class UserService {
  static async getUserByEmail(email: string) {
    return (
      await db
        .select()
        .from(users)
        .where(eq(users.email, email ?? ""))
    )?.[0] as User;
  }
}
