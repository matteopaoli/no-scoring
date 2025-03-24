"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticators = exports.verificationTokens = exports.sessions = exports.accounts = exports.subscriptions = exports.earnings = exports.regions = exports.areas = exports.commissionRules = exports.products = exports.businessType = exports.userStoreRoles = exports.sales = exports.stores = exports.users = exports.db = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
require("dotenv/config");
const pool = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
exports.db = (0, postgres_js_1.drizzle)(pool);
exports.users = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: (0, pg_core_1.text)("firstName"),
    lastName: (0, pg_core_1.text)("lastName"),
    email: (0, pg_core_1.text)("email").unique().notNull(),
    password: (0, pg_core_1.text)("password"),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    image: (0, pg_core_1.text)("image"),
    role: (0, pg_core_1.text)("role").notNull(),
    businessTypeId: (0, pg_core_1.integer)("businessTypeId").references(() => exports.businessType.id),
    businessName: (0, pg_core_1.text)("businessName"),
    onboardingCompleted: (0, pg_core_1.boolean)("onboardingCompleted").default(false),
    stripeUserId: (0, pg_core_1.text)("stripeUserId"),
    tosAccepted: (0, pg_core_1.boolean)("tosAccepted").notNull().default(false),
    tosAcceptedAt: (0, pg_core_1.timestamp)("tosAcceptedAt", { mode: "date" }),
    regionId: (0, pg_core_1.integer)("regionId").references(() => exports.regions.id),
    partnerId: (0, pg_core_1.text)("partnerId").references(() => exports.users.id),
    onboardingLink: (0, pg_core_1.text)("onboardingLink"),
    status: (0, pg_core_1.text)("status").notNull(),
    phoneNumber: (0, pg_core_1.varchar)("phoneNumber", { length: 15 }),
    refName: (0, pg_core_1.text)("refName"),
    leadStatus: (0, pg_core_1.text)("leadStatus").default('to_contact'),
    notes: (0, pg_core_1.text)("notes"),
    magicLinkUrl: (0, pg_core_1.text)("magicLinkUrl"),
    name: (0, pg_core_1.text)("name"),
    emailVerified: (0, pg_core_1.timestamp)("emailVerified", { mode: "date" })
});
exports.stores = (0, pg_core_1.pgTable)("store", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    image: (0, pg_core_1.text)("image"),
    partnerId: (0, pg_core_1.text)("partnerId").references(() => exports.users.id),
    isSubscriptionActive: (0, pg_core_1.boolean)("isSubscriptionActive").default(true)
});
exports.sales = (0, pg_core_1.pgTable)("sale", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    storeId: (0, pg_core_1.text)("storeId")
        .notNull()
        .references(() => exports.stores.id)
        .notNull(),
    amount: (0, pg_core_1.numeric)("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
    stripePaymentIntentId: (0, pg_core_1.text)("stripePaymentIntentId").notNull(),
});
exports.userStoreRoles = (0, pg_core_1.pgTable)("userStoreRole", {
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id),
    storeId: (0, pg_core_1.text)("storeId")
        .notNull()
        .references(() => exports.stores.id),
    role: (0, pg_core_1.text)("role").notNull(),
    createdAt: (0, pg_core_1.timestamp)("createdAt").defaultNow(),
});
exports.businessType = (0, pg_core_1.pgTable)("businessType", {
    id: (0, pg_core_1.serial)("id").primaryKey(), // Auto-incrementing ID
    name: (0, pg_core_1.text)("name").notNull(), // Name of the business type
});
exports.products = (0, pg_core_1.pgTable)("product", {
    id: (0, pg_core_1.text)("id").notNull(),
    qrcode: (0, pg_core_1.text)("qrcode"),
    tagImage: (0, pg_core_1.text)("tagImage"),
    paymentLinkId: (0, pg_core_1.text)("paymentLinkId"),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    type: (0, pg_core_1.text)("type").notNull().default("product"),
});
exports.commissionRules = (0, pg_core_1.pgTable)("commissionRules", {
    id: (0, pg_core_1.serial)("id").primaryKey(), // Auto-incrementing ID for the rule
    businessTypeId: (0, pg_core_1.integer)("businessTypeId")
        .references(() => exports.businessType.id)
        .notNull(), // Foreign key to businessType
    minAmount: (0, pg_core_1.numeric)("minAmount", { precision: 10, scale: 2 }).notNull(), // Minimum amount for the commission range
    maxAmount: (0, pg_core_1.numeric)("maxAmount", { precision: 10, scale: 2 }), // Maximum amount for the commission range
    commissionType: (0, pg_core_1.text)("commissionType").notNull(), // 'flat' or 'percentage'
    commissionValue: (0, pg_core_1.numeric)("commissionValue", {
        precision: 10,
        scale: 2,
    }).notNull(), // Value of the commission (flat amount or percentage)
});
exports.areas = (0, pg_core_1.pgTable)("areas", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    managerId: (0, pg_core_1.text)("managerId").references(() => exports.users.id)
});
exports.regions = (0, pg_core_1.pgTable)("regions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    areaId: (0, pg_core_1.integer)("areaId").references(() => exports.areas.id)
});
exports.earnings = (0, pg_core_1.pgTable)("earnings", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    saleId: (0, pg_core_1.text)("saleId").references(() => exports.sales.id),
    amount: (0, pg_core_1.numeric)("amount", {
        precision: 12,
        scale: 2,
    }).notNull(),
    partnerId: (0, pg_core_1.text)("partnerId").references(() => exports.users.id),
    sourcePartnerId: (0, pg_core_1.text)("sourcePartnerId").references(() => exports.users.id),
    type: (0, pg_core_1.text)("type"),
    originStore: (0, pg_core_1.text)("originStore")
});
exports.subscriptions = (0, pg_core_1.pgTable)("subscription", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    storeId: (0, pg_core_1.text)("storeId").references(() => exports.stores.id).notNull(),
    amount: (0, pg_core_1.numeric)("amount", {
        precision: 12,
        scale: 2,
    }),
    partnerFee: (0, pg_core_1.numeric)("partnerFee", {
        precision: 12,
        scale: 2,
    }),
    upperPartnerFee: (0, pg_core_1.numeric)("upperPartnerFee", {
        precision: 12,
        scale: 2,
    }),
});
exports.accounts = (0, pg_core_1.pgTable)("account", {
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    type: (0, pg_core_1.text)("type").$type().notNull(),
    provider: (0, pg_core_1.text)("provider").notNull(),
    providerAccountId: (0, pg_core_1.text)("providerAccountId").notNull(),
    refresh_token: (0, pg_core_1.text)("refresh_token"),
    access_token: (0, pg_core_1.text)("access_token"),
    expires_at: (0, pg_core_1.integer)("expires_at"),
    token_type: (0, pg_core_1.text)("token_type"),
    scope: (0, pg_core_1.text)("scope"),
    id_token: (0, pg_core_1.text)("id_token"),
    session_state: (0, pg_core_1.text)("session_state"),
}, (account) => ({
    compoundKey: (0, pg_core_1.primaryKey)({
        columns: [account.provider, account.providerAccountId],
    }),
}));
exports.sessions = (0, pg_core_1.pgTable)("session", {
    sessionToken: (0, pg_core_1.text)("sessionToken").primaryKey(),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    expires: (0, pg_core_1.timestamp)("expires", { mode: "date" }).notNull(),
});
exports.verificationTokens = (0, pg_core_1.pgTable)("verificationToken", {
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    token: (0, pg_core_1.text)("token").notNull(),
    expires: (0, pg_core_1.timestamp)("expires", { mode: "date" }).notNull(),
}, (verificationToken) => ({
    compositePk: (0, pg_core_1.primaryKey)({
        columns: [verificationToken.identifier, verificationToken.token],
    }),
}));
exports.authenticators = (0, pg_core_1.pgTable)("authenticator", {
    credentialID: (0, pg_core_1.text)("credentialID").notNull().unique(),
    userId: (0, pg_core_1.text)("userId")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    providerAccountId: (0, pg_core_1.text)("providerAccountId").notNull(),
    credentialPublicKey: (0, pg_core_1.text)("credentialPublicKey").notNull(),
    counter: (0, pg_core_1.integer)("counter").notNull(),
    credentialDeviceType: (0, pg_core_1.text)("credentialDeviceType").notNull(),
    credentialBackedUp: (0, pg_core_1.boolean)("credentialBackedUp").notNull(),
    transports: (0, pg_core_1.text)("transports"),
}, (authenticator) => ({
    compositePK: (0, pg_core_1.primaryKey)({
        columns: [authenticator.userId, authenticator.credentialID],
    }),
}));
