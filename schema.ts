import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  numeric,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
import 'dotenv/config'
 
const pool = postgres(process.env.DATABASE_URL!, { max: 1 })
 
export const db = drizzle(pool)
 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique(),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow(),
  image: text("image"),
  stripeSecretKey: text('stripeSecretKey'),
  role: text('role').notNull(),
  businessTypeId: integer("businessTypeId").references(() => businessType.id),
  businessName: text("businessName"),
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  stripeUserId: text('stripeUserId'),
  stripeLegAccountId: text('stripeLegAccountId'),
  genericProductId: text('genericProductId'),
  genericProductSmallImage: text('genericProductSmallImage'),
  genericProductLargeImage: text('genericProductLargeImage'),
  tosAccepted: boolean("tosAccepted").notNull().default(false),
  tosAcceptedAt: timestamp("tosAcceptedAt", { mode: "date" }),
  provincia: text('provincia'),
  partnerId: text('partnerId').references(() => users.id)
})

export const webhookSecrets = pgTable("webhookSecret", {
  accountId: text('accountId'),
  secret: text('secret'),
})

export const stores = pgTable("store", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  image: text('image'),
})

export const sales = pgTable("sale", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId").notNull().references(() => stores.id).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  stripePaymentIntentId: text("stripePaymentIntentId").notNull(),
  legCommission: numeric("legCommission", { precision: 12, scale: 2 }).notNull(),
  firstLevelPartnerCommission: numeric("firstLevelPartnerCommission", { precision: 12, scale: 2 }).notNull(),
  secondLevelPartnerCommission: numeric("secondLevelPartnerCommission", { precision: 12, scale: 2 }).notNull(),
})

export const userStoreRoles = pgTable("userStoreRole", {
  userId: text("userId").notNull().references(() => users.id),
  storeId: text("storeId").notNull().references(() => stores.id),
  role: text('role').notNull(),
  createdAt: timestamp("createdAt").defaultNow()
})

export const businessType = pgTable('businessType', {
  id: serial('id').primaryKey(), // Auto-incrementing ID
  name: text('name').notNull(), // Name of the business type
});

export const products = pgTable("product", {
  id: text('id').notNull(),
  qrcode: text('qrcode'),
  tagImage: text('tagImage'),
  paymentLinkId: text('paymentLinkId'),
  userId: text('userId') // Foreign key to the users table
    .notNull()
    .references(() => users.id) // References the id field in the users table
});
// New table to store commission rules
export const commissionRules = pgTable('commissionRules', {
  id: serial('id').primaryKey(), // Auto-incrementing ID for the rule
  businessTypeId: integer('businessTypeId').references(() => businessType.id).notNull(), // Foreign key to businessType
  minAmount: numeric('minAmount', { precision: 10, scale: 2 }).notNull(), // Minimum amount for the commission range
  maxAmount: numeric('maxAmount', { precision: 10, scale: 2 }), // Maximum amount for the commission range
  commissionType: text('commissionType').notNull(), // 'flat' or 'percentage'
  commissionValue: numeric('commissionValue', { precision: 10, scale: 2 }).notNull(), // Value of the commission (flat amount or percentage)
});
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)