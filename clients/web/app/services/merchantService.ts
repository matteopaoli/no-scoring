import {
  businessType,
  products,
  regions,
  sales,
  stores,
  users,
  userStoreRoles,
  db
} from "@paytomorrow/db";
import { and, count, desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { UserService } from "./userService";
import { alias } from "drizzle-orm/pg-core";
import { PartnerService } from "./partnerService";
import { randomBytes } from "node:crypto";

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
    regionId,
  }: {
    email: string;
    businessTypeId: number;
    businessName: string;
    onboardingLink: string;
    stripeUserId: string;
    partnerId?: string;
    phoneNumber: string;
    refName: string;
    regionId: number;
  }) {
    const hash = UserService.getDefaultPassword();
    const inviteCode = await UserService.generateInviteCode();
    const apiKey = randomBytes(32).toString('hex');
    
    return await db.insert(users).values({
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
      regionId,
      inviteCode,
      apiKey,
    }).returning();
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
        regionName: regions.name,
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
      .leftJoin(regions, eq(users.regionId, regions.id))
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
          regionId: users.regionId,
          partnerId: users.partnerId
        })
        .from(users)
        .where(eq(users.stripeUserId, stripeUserId))
    )?.[0];
  }

  static async getAllActiveMerchants(userId: string) {
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
      .where(and(eq(users.role, "user"), eq(users.status, "active"), inArray(users.id, await PartnerService.getMerchantsNetwork(userId))))
      .groupBy(users.id);
  }

  static async getMerchantsWithDetailedMetrics(userId: string) {
    const partner = alias(users, "partner");
    const selectedColumns = {
      ...getTableColumns(users),
      businessType: businessType.name,
      partnerName: sql<string>`CONCAT(partner."firstName", ' ', partner."lastName")`.as("partnerName"),
      storeId: stores.id,
      storeName: stores.name,
      storeImage: stores.image,
      storeCreatedAt: stores.createdAt,
      phoneNumber: users.phoneNumber,
      regionName: regions.name,
    };
  
    // Perform the query
    return await db
      .select(selectedColumns)
      .from(users)
      .leftJoin(businessType, eq(users.businessTypeId, businessType.id))
      .leftJoin(partner, eq(users.partnerId, partner.id))
      .leftJoin(userStoreRoles, eq(users.id, userStoreRoles.userId))
      .leftJoin(stores, eq(userStoreRoles.storeId, stores.id))
      .leftJoin(sales, eq(stores.id, sales.storeId))
      .leftJoin(regions, eq(users.regionId, regions.id)) // Join regions to get the region name
      .where(and(eq(users.role, "user"), eq(users.status, "active"), inArray(users.id, await PartnerService.getMerchantsNetwork(userId))))
      .groupBy(
        users.id,
        partner.id,
        businessType.name,
        stores.id,
        regions.id // Ensure the region is included in group by for aggregation
      );
  }
  

  static async updateNotes(userId: string, value: string) {
    return await db.update(users).set({ notes: value }).where(eq(users.id, userId));
  }
}
