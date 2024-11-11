import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '../../app/db'; // Adjust the import path as needed
import { users } from '../../schema';
import { eq } from 'drizzle-orm';
import { MerchantService } from '../../app/services/merchantService';

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
    await MerchantService.createMerchant(userData)

    const insertedUser = (await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email)))?.[0];

    expect(insertedUser).toBeTruthy();
    expect(insertedUser?.email).toBe(userData.email);
    expect(insertedUser?.businessTypeId).toBe(userData.businessTypeId);
    expect(insertedUser?.businessName).toBe(userData.businessName);
    expect(insertedUser?.onboardingLink).toBe(userData.onboardingLink);
    expect(insertedUser?.status).toBe("awaiting");
    expect(insertedUser?.stripeUserId).toBe(userData.stripeUserId);
  });
});

describe("initMerchant", () => {
  it("should update the user status to active and set a default password", async () => {
    // Arrange
    const user = await db.insert(users).values({
      ...userData,
      status: 'awaiting',
      role: 'user',
    }).returning();

    const userId = user?.[0].id

    // Act
    await MerchantService.initMerchant(userId);

    // Assert
    const updatedUser = (await db
      .select()
      .from(users)
      .where(eq(users.id, userId)))?.[0];

    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.status).toBe("active");
    expect(updatedUser?.password).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });
});

