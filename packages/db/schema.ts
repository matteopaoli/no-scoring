import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  numeric,
  varchar,
  PgColumn,
  geometry,
  jsonb,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import "dotenv/config";

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").unique().notNull(),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow(),
  image: text("image"),
  role: text("role").notNull(),
  businessTypeId: integer("businessTypeId").references(() => businessType.id),
  businessName: text("businessName"),
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  stripeUserId: text("stripeUserId"),
  tosAccepted: boolean("tosAccepted").notNull().default(false),
  tosAcceptedAt: timestamp("tosAcceptedAt", { mode: "date" }),
  regionId: integer("regionId").references((): PgColumn => regions.id),
  partnerId: text("partnerId").references((): PgColumn => users.id),
  onboardingLink: text("onboardingLink"),
  status: text("status").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 15 }),
  refName: text("refName"),
  leadStatus: text("leadStatus").default("to_contact"),
  notes: text("notes"),
  magicLinkUrl: text("magicLinkUrl"),
  name: text("name"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  resetToken: text("resetToken"),
  inviteCode: text("inviteCode"),
  referrerCustomerId: text("referrerCustomerId")
});

export const stores = pgTable("store", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  image: text("image"),
  partnerId: text("partnerId").references(() => users.id),
  isSubscriptionActive: boolean("isSubscriptionActive").default(true),
  description: text("description"),
  address: text("address"),
  location: geometry("location", { type: 'point', srid: 4326 }),
  geodata: jsonb('geodata').$type<{ lng: number, lat: number, placeId: string }>(),
  customerPaysFees: boolean('customerPaysFees').notNull().default(false),
  apiKey: text("apiKey"),
});

export const sales = pgTable("sale", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id)
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  stripePaymentIntentId: text("stripePaymentIntentId").notNull(),
});

export const userStoreRoles = pgTable("userStoreRole", {
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id),
  role: text("role").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const businessType = pgTable("businessType", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const products = pgTable("product", {
  id: text("id").notNull(),
  qrcode: text("qrcode"),
  tagImage: text("tagImage"),
  paymentLinkId: text("paymentLinkId"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("product"),
});

export const commissionRules = pgTable("commissionRules", {
  id: serial("id").primaryKey(), // Auto-incrementing ID for the rule
  businessTypeId: integer("businessTypeId")
    .references(() => businessType.id)
    .notNull(), // Foreign key to businessType
  minAmount: numeric("minAmount", { precision: 10, scale: 2 }).notNull(), // Minimum amount for the commission range
  maxAmount: numeric("maxAmount", { precision: 10, scale: 2 }), // Maximum amount for the commission range
  commissionType: text("commissionType").notNull(), // 'flat' or 'percentage'
  commissionValue: numeric("commissionValue", {
    precision: 10,
    scale: 2,
  }).notNull(), // Value of the commission (flat amount or percentage)
});

export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  managerId: text("managerId").references(() => users.id),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  areaId: integer("areaId").references(() => areas.id),
});

export const earnings = pgTable("earnings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  saleId: text("saleId").references(() => sales.id),
  amount: numeric("amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
  partnerId: text("partnerId").references(() => users.id),
  sourcePartnerId: text("sourcePartnerId").references(() => users.id),
  type: text("type"),
  originStore: text("originStore"),
});

export const subscriptions = pgTable("subscription", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .references(() => stores.id)
    .notNull(),
  amount: numeric("amount", {
    precision: 12,
    scale: 2,
  }),
  partnerFee: numeric("partnerFee", {
    precision: 12,
    scale: 2,
  }),
  upperPartnerFee: numeric("upperPartnerFee", {
    precision: 12,
    scale: 2,
  }),
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
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

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
);

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
);
