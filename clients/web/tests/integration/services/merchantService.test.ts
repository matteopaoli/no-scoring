import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { sales, stores, users, db } from "@paytomorrow/db";
import { and, eq, inArray, or } from "drizzle-orm";
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

describe("getAllActiveMerchants", () => {
  const activeUser1 = {
    email: "active1@example.com",
    businessTypeId: 2,
    businessName: "Active Business 1",
    onboardingLink: "https://example.com/onboard1",
    stripeUserId: "stripe_123",
    role: "user",
    status: "active",
  };

  const activeUser2 = {
    email: "active2@example.com",
    businessTypeId: 2,
    businessName: "Active Business 2",
    onboardingLink: "https://example.com/onboard2",
    stripeUserId: "stripe_456",
    role: "user",
    status: "active",
  };

  const inactiveUser = {
    email: "inactive@example.com",
    businessTypeId: 3,
    businessName: "Inactive Business",
    onboardingLink: "https://example.com/onboard3",
    stripeUserId: "stripe_789",
    role: "user",
    status: "inactive",
  };

  beforeAll(async () => {
    await db.insert(users).values([activeUser1, activeUser2, inactiveUser]);
  });

  afterAll(async () => {
    await db
      .delete(users)
      .where(
        or(
          eq(users.email, activeUser1.email),
          eq(users.email, activeUser2.email),
          eq(users.email, inactiveUser.email)
        )
      );
  });

  it("should return only the active merchants added by this test", async () => {
    const result = await MerchantService.getAllActiveMerchants();

    const testUsers = result.filter((merchant) =>
      [activeUser1.email, activeUser2.email].includes(merchant.email)
    );

    expect(testUsers).toHaveLength(2); // Expect 2 active merchants from the test data
    const emails = testUsers.map((merchant) => merchant.email);
    expect(emails).toContain(activeUser1.email);
    expect(emails).toContain(activeUser2.email);
  });

  it("should not include inactive merchants from the test data", async () => {
    const result = await MerchantService.getAllActiveMerchants();

    const emails = result.map((merchant) => merchant.email);
    expect(emails).not.toContain(inactiveUser.email);
  });
});

describe("getMerchantsWithDetailedMetrics", () => {
  const testUser1 = {
    email: "testuser1@example.com",
    businessTypeId: 4,
    firstName: "John",
    lastName: "Doe",
    role: "user",
    status: "active",
  };

  const testUser2 = {
    email: "testuser2@example.com",
    businessTypeId: 2,
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    status: "active",
  };

  const inactiveUser = {
    email: "inactiveuser@example.com",
    businessTypeId: 3,
    firstName: "Inactive",
    lastName: "User",
    role: "user",
    status: "inactive",
  };

  const store1 = {
    name: "Store 1",
    image: "store1.jpg",
    createdAt: new Date(),
  };

  const store2 = {
    name: "Store 2",
    image: "store2.jpg",
    createdAt: new Date(),
  };

  const sale1 = {
    legCommission: "100.00",
    amount: "500.00",
    createdAt: new Date(),
    stripePaymentIntentId: "pi_123",
    firstLevelPartnerCommission: "50.00",
    secondLevelPartnerCommission: "25.00",
  };

  const sale2 = {
    legCommission: "150.00",
    amount: "750.00",
    createdAt: new Date(),
    stripePaymentIntentId: "pi_456",
    firstLevelPartnerCommission: "50.00",
    secondLevelPartnerCommission: "25.00",
  };

  beforeAll(async () => {
    // Insert test data into the database
    await db.insert(users).values([testUser1, testUser2, inactiveUser]);
    const [insertedStore1] = await db
      .insert(stores)
      .values(store1)
      .returning({ id: stores.id });
    const [insertedStore2] = await db
      .insert(stores)
      .values(store2)
      .returning({ id: stores.id });

    // Use the retrieved store IDs to insert sales
    await db.insert(sales).values([
      { ...sale1, storeId: insertedStore1.id },
      { ...sale2, storeId: insertedStore2.id },
    ]);
  });

  afterAll(async () => {
    // Clean up test data from the database
    await db
      .delete(sales)
      .where(inArray(sales.stripePaymentIntentId, ["pi_123", "pi_456"]));
    await db
      .delete(users)
      .where(
        or(
          eq(users.email, testUser1.email),
          eq(users.email, testUser2.email),
          eq(users.email, inactiveUser.email)
        )
      );
    await db
      .delete(stores)
      .where(or(eq(stores.name, store1.name), eq(stores.name, store2.name)));
  });

  it("should return active users with store and commission details", async () => {
    const result = await MerchantService.getMerchantsWithDetailedMetrics();

    // Filter results to match test data
    const testUsers = result.filter((user) =>
      [testUser1.email, testUser2.email].includes(user.email)
    );

    expect(testUsers).toHaveLength(2); // Expect only active test users
    const emails = testUsers.map((user) => user.email);
    expect(emails).toContain(testUser1.email);
    expect(emails).toContain(testUser2.email);

    // Check store and commission details
    testUsers.forEach((user) => {
      expect(user.storeName).toBeDefined();
      expect(parseFloat(user.totalCommission)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(user.totalVolume)).toBeGreaterThanOrEqual(0);
    });
  });

  it("should not include inactive users", async () => {
    const result = await MerchantService.getMerchantsWithDetailedMetrics();

    const emails = result.map((user) => user.email);
    expect(emails).not.toContain(inactiveUser.email);
  });
});
