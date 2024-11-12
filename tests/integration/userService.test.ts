import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { db, User } from "../../app/db"; // Adjust the import path as needed
import { users } from "../../schema";
import { eq } from "drizzle-orm";
import { UserService } from "../../app/services/userService";
import { compareSync } from 'bcrypt-ts'

// Define the user data as a fixture
const userData = {
  email: "test@example.com",
  businessTypeId: 3,
  role: 'user',
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

describe("getUserByEmail", () => {
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
    const foundUser = await UserService.getUserByEmail(null as unknown as string);
    expect(foundUser).toBeUndefined();
  });

  it("should return undefined if the email is an empty string", async () => {
    const foundUser = await UserService.getUserByEmail("");
    expect(foundUser).toBeUndefined();
  });
});

describe("getUserById", () => {
  it("returns a user when a valid ID is provided", async () => {
    const [insertedUser] = await db.insert(users).values({
      ...userData,
      status: "awaiting",
    }).returning();
    
    const userId = insertedUser.id;
    const foundUser = await UserService.getUserById(userId);

    expect(foundUser).toBeTruthy();
    expect(foundUser?.id).toBe(userId);
    expect(foundUser?.email).toBe(userData.email);
  });

  it("returns undefined when the user ID does not exist", async () => {
    const foundUser = await UserService.getUserById("nonexistent-id");
    expect(foundUser).toBeUndefined();
  });

  it("returns undefined when an empty ID is provided", async () => {
    const foundUser = await UserService.getUserById("");
    expect(foundUser).toBeUndefined();
  });
});

describe("getDefaultPassword", () => {
  it("generates a valid bcrypt hash", () => {
    const defaultPasswordHash = UserService.getDefaultPassword();
    expect(defaultPasswordHash).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });

  it("produces different hashes for each call", () => {
    const hash1 = UserService.getDefaultPassword();
    const hash2 = UserService.getDefaultPassword();
    expect(hash1).not.toBe(hash2);
  });

  it("correctly matches the default password when verified", () => {
    const hash = UserService.getDefaultPassword();
    const isMatch = compareSync("PayTomorrow!2024", hash);
    expect(isMatch).toBe(true);
  });
});

describe("isPartner", () => {
  it("should return true for a user with the role 'partner'", () => {
    const user = { role: "partner" } as User;
    const result = UserService.isPartner(user);
    expect(result).toBe(true);
  });

  it("should return true for a user with the role 'subpartner'", () => {
    const user = { role: "subpartner" } as User;
    const result = UserService.isPartner(user);
    expect(result).toBe(true);
  });

  it("should return false for a user with a non-partner role", () => {
    const user = { role: "admin" } as User;
    const result = UserService.isPartner(user);
    expect(result).toBe(false);
  });

  it("should return false if the user role is undefined", () => {
    const user = { role: undefined as unknown } as User;
    const result = UserService.isPartner(user);
    expect(result).toBe(false);
  });

  it("should return false if the user role is null", () => {
    const user = { role: null as unknown } as User;
    const result = UserService.isPartner(user);
    expect(result).toBe(false);
  });
});

describe("isAdmin", () => {
  it("should return true for a user with the role 'admin'", () => {
    const user = { role: "admin" } as User;
    const result = UserService.isAdmin(user);
    expect(result).toBe(true);
  });

  it("should return false for a user with a non-partner role", () => {
    const user = { role: "subpartner" } as User;
    const result = UserService.isAdmin(user);
    expect(result).toBe(false);
  });

  it("should return false if the user role is undefined", () => {
    const user = { role: undefined as unknown } as User;
    const result = UserService.isAdmin(user);
    expect(result).toBe(false);
  });

  it("should return false if the user role is null", () => {
    const user = { role: null as unknown } as User;
    const result = UserService.isAdmin(user);
    expect(result).toBe(false);
  });
});
