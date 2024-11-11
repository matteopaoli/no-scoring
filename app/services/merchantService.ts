import { users } from "schema";
import { db, getDefaultPassword, User } from "../db";
import { eq } from "drizzle-orm";

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
    const hash = getDefaultPassword();

    return await db
      .update(users)
      .set({
        status: "active",
        password: hash,
      })
      .where(eq(users.id, userId));
  }
}
