import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { users } from 'schema'

let client = postgres(`${process.env.POSTGRES_URL!}`);
let db = drizzle(client);

export async function getUser(email: string) {
  return (await db.select().from(users).where(eq(users.email, email)))?.[0];
}

export async function createUser(email: string, password: string) {

  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}