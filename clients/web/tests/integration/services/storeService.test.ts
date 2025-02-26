import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { db } from "../../../app/db"; 
import { users, stores, userStoreRoles, sales } from "../../../schema"; 
import { eq } from "drizzle-orm";
import { getStoreByUserId, getStoresByPartnerId } from "../../../app/db";

// Define test data
const partnerId = "partner-123";
const merchantId = "merchant-456";
const storeId = "store-789";
const saleId = "sale-101";

// Helper function to clear relevant tables before and after each test
async function clearTables() {
  // Delete sale
  await db.delete(sales).where(eq(sales.id, saleId));
  // Delete user-store role
  await db.delete(userStoreRoles).where(eq(userStoreRoles.userId, merchantId));
  // Delete store
  await db.delete(stores).where(eq(stores.id, storeId));
  // Delete merchant and partner users
  await db.delete(users).where(eq(users.id, merchantId));
  await db.delete(users).where(eq(users.id, partnerId));
}

beforeEach(async () => {
  await clearTables(); // Clean up before each test

  // Insert a partner record to satisfy the foreign key constraint
  await db.insert(users).values({
    id: partnerId,
    email: "partner@example.com",
    partnerId: null, // Partners might not have a partnerId
    role: "partner",
    businessName: "Test Partner",
    onboardingLink: "https://example.com/onboard-partner",
    stripeUserId: "stripe_partner",
    status: "active",
  });

  // Insert test data for getStoresByPartnerId
  await db.insert(users).values({
    id: merchantId,
    email: "merchant@example.com",
    partnerId: partnerId,
    role: "user",
    businessName: "Test Merchant",
    onboardingLink: "https://example.com/onboard",
    stripeUserId: "stripe_123",
    status: "active",
  });

  await db.insert(stores).values({
    id: storeId,
    name: "Test Store",
    image: "https://example.com/store-image.jpg",
    createdAt: new Date(),
  });

  await db.insert(userStoreRoles).values({
    userId: merchantId,
    storeId: storeId,
    role: "owner",
  });

  // Provide non-null values for all required fields in sales, including stripePaymentIntentId and legCommission
  await db.insert(sales).values({
    id: saleId,
    storeId: storeId,
    amount: "100.00",
    firstLevelPartnerCommission: "10.00",
    secondLevelPartnerCommission: "5.00",
    legCommission: "2.00", // Added to satisfy not-null constraint
    createdAt: new Date(),
    stripePaymentIntentId: "pi_123", // Already provided previously
  });
});

afterEach(async () => {
  await clearTables(); // Clean up after each test
});

describe("getStoreByUserId", () => {
  it("fetches all business types with their respective commission rules", async () => {
    const store = await getStoreByUserId(
      "c72cfe13-4d55-4de5-850b-753792561669"
    );

    expect(store).toBeDefined();
  });
});

describe("getStoresByPartnerId", () => {
  it("should return stores with correct data for a valid partner ID", async () => {
    const result = await getStoresByPartnerId(partnerId);

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const store = result[0];
    expect(store.storeId).toBe(storeId);
    expect(store.storeName).toBe("Test Store");
    expect(store.storeImage).toBe("https://example.com/store-image.jpg");
    expect(store.createdAt).toBeInstanceOf(Date);
    expect(store.totalCommission).toBe("10.00"); // Sum of firstLevelPartnerCommission
    expect(store.totalVolume).toBe("100.00"); // Sum of amount
    expect(store.commissionsCurrentMonth).toBe("10.00"); // Commission for the current month
    expect(store.volumeCurrentMonth).toBe("100.00"); // Volume for the current month
  });

  it("should return an empty array if no stores are associated with the partner ID", async () => {
    // Remove the user-store role to break the association
    await db.delete(userStoreRoles).where(eq(userStoreRoles.userId, merchantId));

    const result = await getStoresByPartnerId(partnerId);
    expect(result).toEqual([]);
  });

  it("should return an empty array if no merchants are associated with the partner ID", async () => {
    // Remove the merchant
    await db.delete(users).where(eq(users.id, merchantId));

    const result = await getStoresByPartnerId(partnerId);
    expect(result).toEqual([]);
  });

  it("should return an empty array if the partner ID is invalid", async () => {
    const result = await getStoresByPartnerId("invalid-partner-id");
    expect(result).toEqual([]);
  });

  it("should return an empty array if the partner ID is an empty string", async () => {
    const result = await getStoresByPartnerId("");
    expect(result).toEqual([]);
  });

  it("should return an empty array if the partner ID is null", async () => {
    const result = await getStoresByPartnerId(null as unknown as string);
    expect(result).toEqual([]);
  });

  it("should handle cases where there are no sales for a store", async () => {
    // Remove the sales record to simulate no sales
    await db.delete(sales).where(eq(sales.id, saleId));

    const result = await getStoresByPartnerId(partnerId);

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const store = result[0];
    expect(store.totalCommission).toBe("0"); // No sales, so commission should be 0
    expect(store.totalVolume).toBe("0"); // No sales, so volume should be 0
    expect(store.commissionsCurrentMonth).toBe("0"); // No sales, so current month commission should be 0
    expect(store.volumeCurrentMonth).toBe("0"); // No sales, so current month volume should be 0
  });

  it("should handle cases where sales are outside the current month", async () => {
    // Update the sale to be outside the current month
    await db
      .update(sales)
      .set({ createdAt: new Date("2023-01-01") })
      .where(eq(sales.id, saleId));

    const result = await getStoresByPartnerId(partnerId);

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const store = result[0];
    expect(store.totalCommission).toBe("10.00"); // Total commission should still include the sale
    expect(store.totalVolume).toBe("100.00"); // Total volume should still include the sale
    expect(store.commissionsCurrentMonth).toBe("0"); // Sale is outside the current month
    expect(store.volumeCurrentMonth).toBe("0"); // Sale is outside the current month
  });
});
