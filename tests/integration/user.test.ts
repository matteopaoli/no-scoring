import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { db } from "../../app/db"; // Adjust the import path as needed
import { users } from "../../schema";
import { eq } from "drizzle-orm";
import { UserService } from "../../app/services/userService";

// Define the user data as a fixture
const userData = {
  email: "test@example.com",
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

describe("getUser", () => {
  it("should return a user when a valid email is provided", async () => {
    await db.insert(users).values({
      ...userData,
      status: "awaiting",
      role: "user",
    });

    const foundUser = await UserService.getUserByEmail(userData.email);

    expect(foundUser).toBeTruthy();
    expect(foundUser?.email).toBe(userData.email);
    expect(foundUser?.businessTypeId).toBe(userData.businessTypeId);
    expect(foundUser?.businessName).toBe(userData.businessName);
    expect(foundUser?.onboardingLink).toBe(userData.onboardingLink);
    expect(foundUser?.status).toBe("awaiting");
    expect(foundUser?.stripeUserId).toBe(userData.stripeUserId);
  });

  it("should return undefined if no user exists with the provided email", async () => {
    const foundUser = await UserService.getUserByEmail(
      "nonexistent@example.com"
    );
    expect(foundUser).toBeUndefined();
  });

  it("should return undefined if the email is null", async () => {
    const foundUser = await UserService.getUserByEmail(null);
    expect(foundUser).toBeUndefined();
  });

  it("should return undefined if the email is an empty string", async () => {
    const foundUser = await UserService.getUserByEmail("");
    expect(foundUser).toBeUndefined();
  });
});
