import { users } from "schema";
import { db, User } from "../db";
import { eq } from "drizzle-orm";
import { UserService } from "./userService";

export class MerchantService {
  static async createMerchant({
    email,
    businessTypeId,
    businessName,
    onboardingLink,
    stripeUserId,
  }: {
    email: string;
    businessTypeId: number;
    businessName: string;
    onboardingLink: string;
    stripeUserId: string;
  }) {
    await db.insert(users).values({
      email,
      role: "user",
      businessTypeId,
      businessName,
      onboardingLink,
      status: "awaiting",
      stripeUserId,
    });
  }

  static async initMerchant(userId: string) {
    const hash = UserService.getDefaultPassword();

    return await db
      .update(users)
      .set({
        status: "active",
        password: hash,
      })
      .where(eq(users.id, userId));
  }

  static async updateMerchantBusinessInfo(
    email: string,
    businessTypeId: number,
    businessName: string,
  ) {
    return await db
      .update(users)
      .set({
        businessTypeId,
        businessName,
      })
      .where(eq(users.email, email));
  }
}
