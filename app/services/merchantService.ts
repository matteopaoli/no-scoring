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
    partnerId,
  }: {
    email: string;
    businessTypeId: number;
    businessName: string;
    onboardingLink: string;
    stripeUserId: string;
    partnerId?: string
  }) {
    await db.insert(users).values({
      email,
      role: "user",
      businessTypeId,
      businessName,
      onboardingLink,
      status: "pending",
      stripeUserId,
      partnerId
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

  static async getMerchantsByPartnerId(partnerId: string) {
    return await db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      onboardingLink: users.onboardingLink,
      status: users.status
    }).from(users).where(eq(users.partnerId, partnerId))
  }
}
