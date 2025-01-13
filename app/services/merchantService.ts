import {
  businessType,
  products,
  sales,
  stores,
  users,
  userStoreRoles,
} from "schema";
import { db } from "../db";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { UserService } from "./userService";
import { alias } from "drizzle-orm/pg-core";

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
    provincia,
  }: {
    email: string;
    businessTypeId: number;
    businessName: string;
    onboardingLink: string;
    stripeUserId: string;
    partnerId?: string;
    phoneNumber: string;
    refName: string;
    provincia: string;
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
      provincia,
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
        provincia: users.provincia,
        onboardingLink: users.onboardingLink,
        status: users.status,
        name: sql<string>`CASE 
            WHEN ${users.firstName} IS NOT NULL AND ${users.lastName} IS NOT NULL 
            THEN ${users.firstName} || ' ' || ${users.lastName} 
            ELSE ${users.refName} 
          END`,
        phoneNumber: users.phoneNumber,
        leadStatus: users.leadStatus
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

  static async getAllActiveMerchants() {
    return await db
      .select({
        firstName: users.firstName,
        lastName: users.lastName,
        productCount: count(products.id).as("productCount"),
        createdAt: users.createdAt,
        id: users.id,
        status: users.status,
        onboardingLink: users.onboardingLink,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .leftJoin(products, eq(products.userId, users.id))
      .where(and(eq(users.role, "user"), eq(users.status, "active")))
      .groupBy(users.id);
  }

  static async getMerchantsWithDetailedMetrics() {
    const { password, role, businessTypeId, partnerId, ...rest } =
      getTableColumns(users);
    const partner = alias(users, "partner");

    return await db
      .select({
        ...rest,
        businessType: businessType.name,
        partnerName:
          sql<string>`CONCAT(partner."firstName", ' ', partner."lastName")`.as(
            "partnerName"
          ),
        storeId: stores.id,
        storeName: stores.name,
        storeImage: stores.image,
        storeCreatedAt: stores.createdAt,
        totalCommission:
          sql<string>`COALESCE(SUM(CAST(${sales.legCommission} AS numeric)), 0)`.as(
            "totalCommission"
          ),
        totalVolume:
          sql<string>`COALESCE(SUM(CAST(${sales.amount} AS numeric)), 0)`.as(
            "totalVolume"
          ),
        totalCommissionCurrentMonth:
          sql<string>`COALESCE(SUM(CASE WHEN date_trunc('month', ${sales.createdAt}) = date_trunc('month', CURRENT_DATE) THEN CAST(${sales.legCommission} AS numeric) ELSE 0 END), 0)`.as(
            "totalCommissionCurrentMonth"
          ),
        totalVolumeCurrentMonth:
          sql<string>`COALESCE(SUM(CASE WHEN date_trunc('month', ${sales.createdAt}) = date_trunc('month', CURRENT_DATE) THEN CAST(${sales.amount} AS numeric) ELSE 0 END), 0)`.as(
            "totalVolumeCurrentMonth"
          ),
        provincia: users.provincia,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .leftJoin(businessType, eq(users.businessTypeId, businessType.id))
      .leftJoin(partner, eq(users.partnerId, sql`partner.id`))
      .leftJoin(userStoreRoles, eq(users.id, userStoreRoles.userId))
      .leftJoin(stores, eq(userStoreRoles.storeId, stores.id))
      .leftJoin(sales, eq(stores.id, sales.storeId))
      .where(and(eq(users.role, "user"), eq(users.status, "active")))
      .groupBy(users.id, partner.id, businessType.name, stores.id);
  }

  static async updateNotes(userId: string, value: string) {
    return await db.update(users).set({ notes: value }).where(eq(users.id, userId));
  }
}
