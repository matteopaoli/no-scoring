import { drizzle } from "drizzle-orm/postgres-js";
import { eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { businessType, users, commissionRules } from "schema";

let client = postgres(`${process.env.POSTGRES_URL!}`);
let db = drizzle(client);

interface CommissionRule {
  id: number;
  minAmount: number;
  maxAmount: number | null; // maxAmount can be null for infinite range
  commissionType: string;
  commissionValue: number;
}

interface BusinessType {
  id: number;
  name: string;
  commissionRules: CommissionRule[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: Date;
    image: string | null;
    stripeSecretKey: string;
    role: string;
    businessTypeId: number;
    businessName: string;
}

export async function getUser(email: string) {
  return (await db.select().from(users).where(eq(users.email, email)))?.[0] as User;
}

export async function getUserById(id: string) {
  return (await db.select().from(users).where(eq(users.id, id)))?.[0] as User;
}




export async function createUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string
) {
  let salt = genSaltSync(10);
  let hash = hashSync("PayTomorrow!2024", salt);
  return await db.insert(users).values({
    email,
    stripeSecretKey,
    role: "user",
    businessTypeId,
    password: hash,
    businessName,
  });
}

export async function updateUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string
) {
  return await db
    .update(users)
    .set({
      stripeSecretKey,
      businessTypeId,
      businessName,
    })
    .where(eq(users.email, email));
}

export async function setPassword(password: string) {
  // let salt = genSaltSync(10);
  // let hash = hashSync(password, salt);
}

export async function getBusinessTypes(): Promise<BusinessType[]> {
  const result = await db
    .select({
      id: businessType.id,
      name: businessType.name,
      commissionRuleId: commissionRules.id,
      minAmount: commissionRules.minAmount,
      maxAmount: commissionRules.maxAmount,
      commissionType: commissionRules.commissionType,
      commissionValue: commissionRules.commissionValue
    })
    .from(businessType)
    .leftJoin(commissionRules, eq(commissionRules.businessTypeId, businessType.id));

  // Group commission rules by businessType
  const groupedResult: Record<number, BusinessType> = {};

  result.forEach(row => {
    const { id, name, commissionRuleId, minAmount, maxAmount, commissionType, commissionValue } = row;

    if (!groupedResult[id]) {
      groupedResult[id] = {
        id,
        name,
        commissionRules: []
      };
    }

    if (commissionRuleId !== null) {
      groupedResult[id].commissionRules.push({
        id: commissionRuleId,
        minAmount: Number(minAmount),
        maxAmount: maxAmount !== null? Number(maxAmount) : null,
        commissionType: commissionType!,
        commissionValue: Number(commissionValue)
      });
    }
  });

  return Object.values(groupedResult);
}


export async function getUsers() {
  const { password, role, businessTypeId, ...rest } = getTableColumns(users);
  return await db
    .select({ ...rest, businessType: businessType.name })
    .from(users)
    .leftJoin(businessType, eq(users.businessTypeId, businessType.id)) as Omit<User, 'password' | 'role' | 'businessTypeId'>[]
}
