import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { db } from "../../../app/db"; // Adjust the import path as needed
import { users } from "../../../schema";
import { eq, inArray } from "drizzle-orm";
import { MerchantService } from "../../../app/services/merchantService";

// Define the user data as a fixture
const userData = {
  email: "test1@example.com",
  businessTypeId: 3,
  businessName: "Test Business",
  onboardingLink: "https://example.com/onboard",
  stripeUserId: "stripe_123",
};

// Helper function to clear the users table before each test
async function clearUsersTable() {
  await db.delete(users).where(eq(users.email, userData.email));
}

beforeEach(async () => {
  await clearUsersTable(); // Clean up before each test
});

describe("createMerchant", () => {
  it("should insert a new user into the database", async () => {
    await MerchantService.createMerchant(userData);

    const insertedUser = (
      await db.select().from(users).where(eq(users.email, userData.email))
    )?.[0];

    expect(insertedUser).toBeTruthy();
    expect(insertedUser?.email).toBe(userData.email);
    expect(insertedUser?.businessTypeId).toBe(userData.businessTypeId);
    expect(insertedUser?.businessName).toBe(userData.businessName);
    expect(insertedUser?.onboardingLink).toBe(userData.onboardingLink);
    expect(insertedUser?.status).toBe("pending");
    expect(insertedUser?.stripeUserId).toBe(userData.stripeUserId);
  });
});

describe("initMerchant", () => {
  it("should update the user status to active and set a default password", async () => {
    // Arrange
    const user = await db
      .insert(users)
      .values({
        ...userData,
        status: "pending",
        role: "user",
      })
      .returning();

    const userId = user?.[0].id;

    // Act
    await MerchantService.initMerchant(userId);

    // Assert
    const updatedUser = (
      await db.select().from(users).where(eq(users.id, userId))
    )?.[0];

    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.status).toBe("active");
    expect(updatedUser?.password).toMatch(
      /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/
    );
  });
});

describe("updateUser", () => {
  it("updates the user's business type and business name", async () => {
    await db.insert(users).values({
      ...userData,
      status: "active",
      role: "user",
    });

    const newBusinessTypeId = 2;
    const newBusinessName = "Updated Business";

    await MerchantService.updateMerchantBusinessInfo(
      userData.email,
      newBusinessTypeId,
      newBusinessName
    );

    const updatedUser = (
      await db.select().from(users).where(eq(users.email, userData.email))
    )[0];

    expect(updatedUser).toBeTruthy();
    expect(updatedUser.businessTypeId).toBe(newBusinessTypeId);
    expect(updatedUser.businessName).toBe(newBusinessName);
  });

  it("returns no error when updating a non-existing user", async () => {
    await db.insert(users).values({
      ...userData,
      status: "active",
      role: "user",
    });

    const result = await MerchantService.updateMerchantBusinessInfo(
      "nonexistent@example.com",
      3,
      "Nonexistent Business"
    );

    expect(result).toBeDefined();
    expect(result).toEqual([]);
  });

  it("does not change other fields during update", async () => {
    await db.insert(users).values({
      ...userData,
      status: "active",
      role: "user",
    });

    const newBusinessTypeId = 4;
    const newBusinessName = "Another Updated Business";

    await MerchantService.updateMerchantBusinessInfo(
      userData.email,
      newBusinessTypeId,
      newBusinessName
    );

    const updatedUser = (
      await db.select().from(users).where(eq(users.email, userData.email))
    )[0];

    expect(updatedUser.email).toBe(userData.email);
    expect(updatedUser.stripeUserId).toBe("stripe_123");
    expect(updatedUser.onboardingLink).toBe("https://example.com/onboard");
    expect(updatedUser.status).toBe("active");
  });
});

// New test for `getMerchantsByPartnerId`
describe("getMerchantsByPartnerId", () => {
  const partnerData = {
    email: "testpartner10@example.com",
    createdAt: new Date(),
    onboardingLink: "https://example.com/onboard2",
    status: "awaiting",
    role: "partner",
  };

  const merchant1 = {
    email: "testmerchant11@example.com",
    createdAt: new Date(),
    onboardingLink: "https://example.com/onboard1",
    status: "active",
    role: "user",
  };

  const merchant2 = {
    email: "testmerchant12@example.com",
    createdAt: new Date(),
    onboardingLink: "https://example.com/onboard2",
    status: "awaiting",
    role: "user",
  };

  let partnerId = "";

  beforeAll(async () => {
    const partner = (await db.insert(users).values(partnerData).returning())[0];
    partnerId = partner.id;
    await db.insert(users).values([
      { ...merchant1, partnerId: partner.id },
      { ...merchant2, partnerId: partner.id },
    ]);
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.partnerId, partnerId));
    await db.delete(users).where(eq(users.id, partnerId));
  });

  it("should return merchants associated with the given partnerId", async () => {
    const result = await MerchantService.getMerchantsByPartnerId(partnerId);

    expect(result).toHaveLength(2);

    const [returnedMerchant1, returnedMerchant2] = result;

    expect(returnedMerchant1.email).toBe(merchant1.email);
    expect(returnedMerchant1.status).toBe(merchant1.status);
    expect(returnedMerchant1.onboardingLink).toBe(merchant1.onboardingLink);

    expect(returnedMerchant2.email).toBe(merchant2.email);
    expect(returnedMerchant2.status).toBe(merchant2.status);
    expect(returnedMerchant2.onboardingLink).toBe(merchant2.onboardingLink);
  });

  it("should return an empty array if no merchants are associated with the given partnerId", async () => {
    const result = await MerchantService.getMerchantsByPartnerId(
      "non-existent-partner-id"
    );
    expect(result).toEqual([]);
  });
});

describe("getMerchantsByStripeUserId", () => {
  const user = {
    email: "test19@example.com",
    businessTypeId: 3,
    businessName: "Test Business",
    onboardingLink: "https://example.com/onboard",
    stripeUserId: "stripe_123",
    role: "user",
  };
  beforeAll(async () => {
    await db.insert(users).values(user);
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.stripeUserId, user.stripeUserId));
  });

  it("should return merchants associated with the given stripeUserId", async () => {
    const result = await MerchantService.getMerchantByStripeUserId(
      user.stripeUserId
    );

    expect(result).toBeDefined();
    expect(result.email).toBe(user.email);
    expect(result.onboardingLink).toBe(user.onboardingLink);
    expect(result.status).toBe("active");
  });

  it("should return an empty array if no merchants are associated with the given stripeUserId", async () => {
    const result = await MerchantService.getMerchantByStripeUserId(
      "non-existent-stripe-user-id"
    );
    expect(result).toBeUndefined();
  });
});
