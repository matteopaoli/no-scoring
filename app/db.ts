import { drizzle } from "drizzle-orm/postgres-js";
import { eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { businessType, users } from "schema";

let client = postgres(`${process.env.POSTGRES_URL!}`);
let db = drizzle(client);

export async function getUser(email: string) {
  return (await db.select().from(users).where(eq(users.email, email)))?.[0];
}

export async function createUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string,
) {
  let salt = genSaltSync(10);
  let hash = hashSync("PayTomorrow!2024", salt);
  return await db
    .insert(users)
    .values({
      email,
      stripeSecretKey,
      role: "user",
      businessTypeId,
      password: hash,
      businessName
    });
}

export async function setPassword(password: string) {
  // let salt = genSaltSync(10);
  // let hash = hashSync(password, salt);
}

export async function getBusinessTypes() {
  return await db.select().from(businessType);
}

export async function getUsers() {
  const { password, role, ...rest } = getTableColumns(users);
  return await db.select({ ...rest }).from(users);
}
