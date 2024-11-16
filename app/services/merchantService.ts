import { users } from "schema";
import { db, User } from "../db";
import { desc, eq, sql } from "drizzle-orm";
import { UserService } from "./userService";

export class MerchantService {
  static async createMerchant({
    email,
    businessTypeId,
    businessName,
    onboardingLink,
    stripeUserId,
    partnerId,
    phoneNumber,
    refName,
  }: {
    email: string;
    businessTypeId: number;
    businessName: string;
    onboardingLink: string;
    stripeUserId: string;
    partnerId?: string;
    phoneNumber: string;
    refName: string;
  }) {
    const hash = UserService.getDefaultPassword();
    await db.insert(users).values({
      email,
      role: "user",
      businessTypeId,
      businessName,
      onboardingLink,
      status: "pending",
      stripeUserId,
      partnerId,
      phoneNumber,
      refName,
      password: hash,
    });
  }

  static async initMerchant(userId: string) {
    return await db
      .update(users)
      .set({ status: "active" })
      .where(eq(users.id, userId));
  }

  static async updateMerchantBusinessInfo(
    email: string,
    businessTypeId: number,
    businessName: string
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
    return await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        onboardingLink: users.onboardingLink,
        status: users.status,
        name: sql<
        string
      >`CASE 
            WHEN ${users.firstName} IS NOT NULL AND ${users.lastName} IS NOT NULL 
            THEN ${users.firstName} || ' ' || ${users.lastName} 
            ELSE ${users.refName} 
          END`,
        phoneNumber: users.phoneNumber,

      })
      .from(users)
      .where(eq(users.partnerId, partnerId))
      .orderBy(desc(users.createdAt));
  }

  static async getMerchantByStripeUserId(stripeUserId: string) {
    return (
      await db
        .select({
          id: users.id,
          email: users.email,
          createdAt: users.createdAt,
          onboardingLink: users.onboardingLink,
          status: users.status,
        })
        .from(users)
        .where(eq(users.stripeUserId, stripeUserId))
    )?.[0];
  }
}
