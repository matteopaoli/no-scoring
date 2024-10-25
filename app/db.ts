import { drizzle } from "drizzle-orm/postgres-js";
import {
  and,
  count,
  eq,
  getTableColumns,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import {
  businessType,
  users,
  commissionRules,
  stores,
  userStoreRoles,
  products,
  webhookSecrets,
  sales,
} from "schema";
import Stripe from "stripe";
import {
  generateQrCodeWithLogo,
  generateGenericProductImages,
  imageToBase64,
  compressProfileImageToBase64,
} from "./utils/images";
import { createGenericProduct } from "./utils/stripe";
import { alias } from "drizzle-orm/pg-core";

let client = postgres(`${process.env.DATABASE_URL!}`);
let db = drizzle(client);

interface CommissionRule {
  id: number;
  minAmount: number;
  maxAmount: number | null; // maxAmount can be null for infinite range
  commissionType: string;
  commissionValue: number;
  businessTypeId?: number;
}

interface BusinessType {
  id: number;
  name: string;
  commissionRules: CommissionRule[];
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
  image: string | null;
  stripeSecretKey: string;
  role: string;
  businessTypeId: number;
  businessName: string;
  onboardingCompleted: boolean;
  stripeUserId: string;
  stripeLegAccountId: string;
  genericProductId: string;
  genericProductSmallImage: string;
  genericProductLargeImage: string;
  provincia: string;
  partnerId?: string;
}

export async function getUser(email?: string | null) {
  return (
    await db
      .select()
      .from(users)
      .where(eq(users.email, email ?? ""))
  )?.[0] as User;
}

export async function getUserById(id: string) {
  return (await db.select().from(users).where(eq(users.id, id)))?.[0] as User;
}

export async function getUserByStripeAccountId(id: string) {
  return (
    await db.select().from(users).where(eq(users.stripeUserId, id))
  )?.[0] as User;
}

export async function getWebhookSecret(id: string) {
  return (
    await db
      .select()
      .from(webhookSecrets)
      .where(eq(webhookSecrets.accountId, id))
  )?.[0];
}

export const getDefaultPassword = () => {
  const salt = genSaltSync(10);
  const hash = hashSync("PayTomorrow!2024", salt);
  return hash;
};

export async function createUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string,
  stripeUserId: string,
  stripeLegAccountId: string,
  partnerId: string
) {
  const WEBHOOK_URL = `https://app.paytomorrow.it/api/stripe/webhook?merchantId=${stripeUserId}`;
  const hash = getDefaultPassword();

  const stripe = new Stripe(stripeSecretKey);

  const genericProduct = await createGenericProduct(stripe);

  const existingWebhook = (await stripe.webhookEndpoints.list()).data.find(
    (w) => w.url === WEBHOOK_URL
  );

  if (existingWebhook) {
    await stripe.webhookEndpoints.del(existingWebhook.id);
  }

  // Create a new webhook
  const webhook = await stripe.webhookEndpoints.create({
    enabled_events: ["checkout.session.completed"],
    url: `https://app.paytomorrow.it/api/stripe/webhook?merchantId=${stripeUserId}`,
  });

  const genericProductQrCode = await generateQrCodeWithLogo(
    genericProduct.paymentLink.url
  );
  const { genericProductSmallImage, genericProductLargeImage } =
    await generateGenericProductImages(genericProductQrCode);
  await db
    .transaction(async (tx) => {
      // Insert user and get the returned user
      const user = await tx
        .insert(users)
        .values({
          email,
          stripeSecretKey,
          role: "user",
          businessTypeId,
          password: hash,
          businessName,
          stripeUserId,
          stripeLegAccountId,
          genericProductId: genericProduct.productId,
          genericProductSmallImage,
          genericProductLargeImage,
          partnerId,
        })
        .returning();

      // Insert product with the userId from the user created
      await tx.insert(products).values({
        id: genericProduct.productId,
        paymentLinkId: genericProduct.paymentLink.id,
        qrcode: genericProductQrCode,
        tagImage: "",
        userId: user[0].id, // Assuming user[0] contains the new user
      });

      // Delete previous webhook secret
      await tx
        .delete(webhookSecrets)
        .where(eq(webhookSecrets.accountId, stripeUserId));

      // Insert new webhook secret
      await tx.insert(webhookSecrets).values({
        accountId: stripeUserId,
        secret: webhook.secret,
      });
    })
    .catch((error) => {
      console.error("Transaction failed:", error);
      throw error; // Optionally rethrow the error for further handling
    });
}

export async function updateUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string,
  stripeUserId: string,
  stripeLegAccountId: string
) {
  return await db
    .update(users)
    .set({
      stripeSecretKey,
      businessTypeId,
      businessName,
      stripeUserId,
      stripeLegAccountId,
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
      commissionValue: commissionRules.commissionValue,
    })
    .from(businessType)
    .leftJoin(
      commissionRules,
      eq(commissionRules.businessTypeId, businessType.id)
    );

  // Group commission rules by businessType
  const groupedResult: Record<number, BusinessType> = {};

  result.forEach((row) => {
    const {
      id,
      name,
      commissionRuleId,
      minAmount,
      maxAmount,
      commissionType,
      commissionValue,
    } = row;

    if (!groupedResult[id]) {
      groupedResult[id] = {
        id,
        name,
        commissionRules: [],
      };
    }

    if (commissionRuleId !== null) {
      groupedResult[id].commissionRules.push({
        id: commissionRuleId,
        minAmount: Number(minAmount),
        maxAmount: maxAmount !== null ? Number(maxAmount) : null,
        commissionType: commissionType!,
        commissionValue: Number(commissionValue),
      });
    }
  });

  return Object.values(groupedResult);
}

export async function getUsersWithStoresAndCommissions() {
  const { password, role, businessTypeId, partnerId, ...rest } = getTableColumns(users);
  const partner = alias(users, "partner");

  return await db
    .select({
      ...rest,
      businessType: businessType.name,
      partnerName: sql<string>`CONCAT(partner."firstName", ' ', partner."lastName")`.as("partnerName"),
      storeId: stores.id,
      storeName: stores.name,
      storeImage: stores.image,
      storeCreatedAt: stores.createdAt,
      totalCommission: sql`COALESCE(SUM(CAST(${sales.legCommission} AS numeric)), 0)`.as("totalCommission"),
      totalVolume: sql`COALESCE(SUM(CAST(${sales.amount} AS numeric)), 0)`.as("totalVolume"),
    })
    .from(users)
    .leftJoin(businessType, eq(users.businessTypeId, businessType.id))
    .leftJoin(partner, eq(users.partnerId, sql`partner.id`))
    .leftJoin(userStoreRoles, eq(users.id, userStoreRoles.userId))
    .leftJoin(stores, eq(userStoreRoles.storeId, stores.id))
    .leftJoin(sales, eq(stores.id, sales.storeId))
    .where(eq(users.role, "user"))
    .groupBy(
      users.id,
      partner.id,
      businessType.name,
      stores.id
    );
}


export async function updateProfile({
  password,
  profileImage,
  ...rest
}: {
  firstName: string;
  lastName: string;
  profileImage?: Blob | null; // Profilo immagine opzionale
  email: string;
  password?: string;
}) {
  let profileImageData: string | null = null;

  if (!profileImage) {
    await db.update(users).set(rest).where(eq(users.email, rest.email));
  } else {
    if (profileImage && profileImage.size > 0) {
      console.log("dioc");
      console.log(profileImage);
      profileImageData = await compressProfileImageToBase64(profileImage);
    }
    await db
      .update(users)
      .set({
        ...rest,
        ...(profileImageData ? { image: profileImageData } : { image: null }),
      })
      .where(eq(users.email, rest.email));
  }

  if (password) {
    await updatePassword(password, rest.email);
  }
}

export async function createStore({
  storeName,
  storeLogo,
  userId,
}: {
  storeName: string;
  storeLogo: Blob | undefined;
  userId: string;
}) {
  let logoData: string | null = null;
  if (storeLogo) {
    logoData = await imageToBase64(storeLogo);
  }
  const newStore = await db
    .insert(stores)
    .values({
      name: storeName,
      image: logoData,
      partnerId: (await getUserById(userId))?.partnerId,
    })
    .returning();

  const storeId = newStore[0]?.id;
  if (storeId) {
    await db.insert(userStoreRoles).values({
      userId,
      storeId,
      role: "admin",
    });
  }

  return { newStore, success: true };
}

export async function updateStore(
  storeId: string,
  {
    storeName,
    storeLogo,
  }: {
    storeName: string;
    storeLogo?: Blob;
  }
) {
  let logoData: string | null = null;
  let updatedStore = null;
  if (!storeLogo) {
    updatedStore = await db
      .update(stores)
      .set({ name: storeName })
      .where(eq(stores.id, storeId))
      .returning();
  } else {
    if (storeLogo && storeLogo.size > 0) {
      logoData = await imageToBase64(storeLogo);
    }

    updatedStore = await db
      .update(stores)
      .set({
        name: storeName,
        ...(storeLogo && logoData ? { image: logoData } : { image: null }),
      })
      .where(eq(stores.id, storeId))
      .returning();
  }

  return { updatedStore: updatedStore[0] || null, success: true };
}

export async function completeOnboarding(email: string) {
  return await db
    .update(users)
    .set({
      onboardingCompleted: true,
    })
    .where(eq(users.email, email));
}

export async function createBusinessType(bt: BusinessType) {
  const newBusinessType = await db
    .insert(businessType)
    .values({
      name: bt.name,
    })
    .returning();
  const businessTypeId = newBusinessType[0].id!;

  if (businessTypeId && bt.commissionRules.length > 0) {
    for (const rule of bt.commissionRules) {
      await db.insert(commissionRules).values({
        businessTypeId,
        minAmount: rule.minAmount,
        maxAmount: rule.maxAmount,
        commissionType: rule.commissionType,
        commissionValue: rule.commissionValue,
      });
    }
  }

  return { success: true, businessType: newBusinessType[0] };
}

export async function getBusinessTypeById(
  businessTypeId: number
): Promise<BusinessType | null> {
  const result = await db
    .select({
      id: businessType.id,
      name: businessType.name,
      commissionRuleId: commissionRules.id,
      minAmount: commissionRules.minAmount,
      maxAmount: commissionRules.maxAmount,
      commissionType: commissionRules.commissionType,
      commissionValue: commissionRules.commissionValue,
    })
    .from(businessType)
    .leftJoin(
      commissionRules,
      eq(commissionRules.businessTypeId, businessType.id)
    )
    .where(eq(businessType.id, businessTypeId));

  if (result.length === 0) {
    return null;
  }

  const groupedBusinessType: BusinessType = {
    id: result[0].id,
    name: result[0].name,
    commissionRules: [],
  };

  result.forEach((row) => {
    const {
      commissionRuleId,
      minAmount,
      maxAmount,
      commissionType,
      commissionValue,
    } = row;

    if (commissionRuleId !== null) {
      groupedBusinessType.commissionRules.push({
        id: commissionRuleId,
        minAmount: Number(minAmount),
        maxAmount: maxAmount !== null ? Number(maxAmount) : null,
        commissionType: commissionType!,
        commissionValue: Number(commissionValue),
      });
    }
  });

  return groupedBusinessType;
}

export async function getExistingCommissionRules(
  businessTypeId: number
): Promise<CommissionRule[]> {
  const result = await db
    .select({
      id: commissionRules.id,
      businessTypeId: commissionRules.businessTypeId,
      minAmount: commissionRules.minAmount,
      maxAmount: commissionRules.maxAmount,
      commissionType: commissionRules.commissionType,
      commissionValue: commissionRules.commissionValue,
    })
    .from(commissionRules)
    .where(eq(commissionRules.businessTypeId, businessTypeId));

  const existingRules: CommissionRule[] = result.map((rule) => ({
    id: rule.id,
    businessTypeId: rule.businessTypeId,
    minAmount: Number(rule.minAmount),
    maxAmount: rule.maxAmount !== null ? Number(rule.maxAmount) : null,
    commissionType: rule.commissionType,
    commissionValue: Number(rule.commissionValue),
  }));

  return existingRules;
}

type BusinessTypeUpdateData = {
  name?: string;
};

export async function updateBusinessType(
  businessTypeId: number,
  data: BusinessTypeUpdateData,
  cr: CommissionRule[] = []
) {
  const updatedBusinessType = await db
    .update(businessType)
    .set({
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    })
    .where(eq(businessType.id, businessTypeId))
    .returning();

  if (cr.length > 0) {
    await db
      .delete(commissionRules)
      .where(eq(commissionRules.businessTypeId, businessTypeId));

    for (const rule of cr) {
      await db.insert(commissionRules).values({
        businessTypeId,
        minAmount: rule.minAmount,
        maxAmount: rule.maxAmount,
        commissionType: rule.commissionType,
        commissionValue: rule.commissionValue,
      });
    }
  }

  return updatedBusinessType[0];
}

export async function getProduct(id: string) {
  return (await db.select().from(products).where(eq(products.id, id)))?.[0];
}

export async function createProduct(product) {
  return await db.insert(products).values(product);
}

export async function updateProduct(
  productId: string,
  paymentLinkId: string,
  qrcode: string,
  tagImage: string
) {
  return await db
    .update(products)
    .set({ paymentLinkId, qrcode, tagImage })
    .where(eq(products.id, productId));
}

async function updatePassword(password: string, userEmail: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);
  return await db
    .update(users)
    .set({ password: hash })
    .where(eq(users.email, userEmail));
}

export async function deleteUser(id: string) {
  await db.delete(userStoreRoles).where(eq(userStoreRoles.userId, id));
  await db.delete(products).where(eq(products.userId, id));
  const user = await getUserById(id);
  await db
    .delete(webhookSecrets)
    .where(eq(webhookSecrets.accountId, user.stripeUserId));
  return await db.delete(users).where(eq(users.id, id));
}

export async function acceptTOS(email: string) {
  return await db
    .update(users)
    .set({ tosAccepted: true, tosAcceptedAt: new Date() })
    .where(eq(users.email, email));
}

export async function getStoreByUserId(userId: string) {
  const result = await db
    .select({
      id: stores.id,
      name: stores.name,
      image: stores.image,
    })
    .from(stores)
    .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
    .where(eq(userStoreRoles.userId, userId));
  return result[0] || null;
}

export async function createSale({
  stripePaymentIntentId,
  amount,
  storeId,
  legCommission,
  firstLevelPartnerCommission,
  secondLevelPartnerCommission,
}: {
  stripePaymentIntentId: string;
  amount: string;
  storeId: string;
  legCommission: string;
  firstLevelPartnerCommission: string;
  secondLevelPartnerCommission: string;
}) {
  return await db.insert(sales).values({
    stripePaymentIntentId,
    amount,
    storeId,
    legCommission,
    firstLevelPartnerCommission,
    secondLevelPartnerCommission,
  });
}

export async function getAllMerchants() {
  return await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      productCount: count(products.id).as("productCount"),
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(products, eq(products.userId, users.id))
    .where(eq(users.role, "user"))
    .groupBy(users.id);
}

export async function getSales(userId: string, userRole: string) {
  if (userRole === "admin") {
    return await db.select().from(sales);
  }
  if (userRole === "partner" || userRole === "subpartner") {
    const storeIds = await db
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.partnerId, userId));

    const storeIdArray = storeIds.map((store) => store.id);

    const salesData = await db
      .select()
      .from(sales)
      .where(inArray(sales.storeId, storeIdArray));

    return salesData;
  }
}

export async function getPartners() {
  const partners = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "partner"));

  const partnersWithCommissions = await Promise.all(
    partners.map(async (partner) => {
      const firstLevelCommission = await getStoresByPartnerId(partner.id);
      const secondLevelCommission = await getSecondLevelCommissions(partner.id);

      const totalFirstLevelCommission = firstLevelCommission.stores.reduce(
        (acc, store) => acc + (store.totalCommission || 0),
        0
      );

      const totalCommission =
        Number(totalFirstLevelCommission + (secondLevelCommission || 0));

      return {
        ...partner,
        totalCommission,
      };
    })
  );

  return partnersWithCommissions;
}


export async function getSubPartners() {
  // Fetch all subpartners
  const subpartners = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      provincia: users.provincia,
    })
    .from(users)
    .where(eq(users.role, "subpartner"));

  // For each subpartner, fetch the first-level commissions
  const subpartnersWithCommissions = await Promise.all(
    subpartners.map(async (subpartner) => {
      // Fetch first-level commissions for this subpartner
      const merchantStores = (await db
        .select({
          totalCommission: sql`COALESCE(SUM(CAST(${sales.firstLevelPartnerCommission} AS numeric)), 0)`,
        })
        .from(stores)
        .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
        .leftJoin(sales, eq(stores.id, sales.storeId))
        .where(eq(stores.partnerId, subpartner.id))) as { totalCommission: number }[];

      const firstLevelCommission = merchantStores[0]?.totalCommission || 0;

      // Return the subpartner data with totalCommission added
      return {
        ...subpartner,
        totalCommission: Number(firstLevelCommission),
      };
    })
  );

  return subpartnersWithCommissions;
}


export async function createPartner({
  firstName,
  lastName,
  email,
  provincia,
}: Record<string, string>) {
  const hash = getDefaultPassword();
  return await db.insert(users).values({
    firstName,
    lastName,
    email,
    provincia,
    role: "partner",
    password: hash,
  });
}

export async function createSubPartner({
  firstName,
  lastName,
  email,
  provincia,
  partnerId,
}: Record<string, string>) {
  const hash = getDefaultPassword();
  return await db.insert(users).values({
    firstName,
    lastName,
    email,
    provincia,
    role: "subpartner",
    password: hash,
    partnerId,
  });
}

export async function updatePartner({
  firstName,
  lastName,
  provincia,
  id,
}: Record<string, string>) {
  return await db
    .update(users)
    .set({
      firstName,
      lastName,
      provincia,
      role: "partner",
    })
    .where(eq(users.id, id));
}
export async function getSubPartnersByUserId(userId: string) {
  // Fetch all subpartners for the given userId
  const subpartners = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      provincia: users.provincia,
      email: users.email,
    })
    .from(users)
    .where(and(eq(users.partnerId, userId), eq(users.role, "subpartner")));

  // For each subpartner, fetch the first-level commissions
  const subpartnersWithCommissions = await Promise.all(
    subpartners.map(async (subpartner) => {
      // Fetch first-level commissions for this subpartner
      const merchantStores = (await db
        .select({
          totalCommission: sql`COALESCE(SUM(CAST(${sales.firstLevelPartnerCommission} AS numeric)), 0)`,
        })
        .from(stores)
        .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
        .leftJoin(sales, eq(stores.id, sales.storeId))
        .where(eq(stores.partnerId, subpartner.id))) as { totalCommission: number }[];

      const firstLevelCommission = merchantStores[0]?.totalCommission || 0;

      // Return the subpartner data with totalCommission added
      return {
        ...subpartner,
        totalCommission: Number(firstLevelCommission),
      };
    })
  );

  return subpartnersWithCommissions;
}


export async function searchPartner(query: string) {
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(
      and(
        or(
          like(users.firstName, `%${query}%`),
          like(users.lastName, `%${query}%`),
          like(users.email, `%${query}%`)
        ),
        inArray(users.role, ["partner", "subpartner"])
      )
    );
}

export async function getAllPartners() {
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(inArray(users.role, ["partner", "subpartner"]));
}

export async function getPartnerById(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(
      and(eq(users.id, userId), inArray(users.role, ["partner", "subpartner"]))
    );
  return result[0] || null;
}

export async function getStoresByPartnerId(partnerId: string) {
  const merchantIds = (
    await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(and(eq(users.partnerId, partnerId), eq(users.role, "user")))
  ).map((user) => user.id);

  const inactiveMerchants = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        eq(users.partnerId, partnerId),
        eq(users.onboardingCompleted, false),
        eq(users.role, "user")
      )
    );

  const merchantStores = (await db
    .select({
      storeId: stores.id,
      storeName: stores.name,
      storeImage: stores.image,
      createdAt: stores.createdAt,
      totalCommission: sql`COALESCE(SUM(CAST(${sales.firstLevelPartnerCommission} AS numeric)), 0)`,
    })
    .from(stores)
    .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
    .leftJoin(sales, eq(stores.id, sales.storeId))
    .where(inArray(userStoreRoles.userId, merchantIds))
    .groupBy(stores.id)) as {
    storeId: string;
    storeName: string;
    storeImage: string | null;
    createdAt: Date | null;
    totalCommission: number;
  }[];

  return { stores: merchantStores, inactiveMerchants };
}

export async function getSecondLevelCommissions(
  partnerId: string
): Promise<number | null> {
  const user = await getUserById(partnerId);
  if (user.role !== "partner") {
    return null;
  }
  const subpartners = (await getSubPartnersByUserId(partnerId)).map(
    (subpartner) => subpartner.id
  );
  const secondLevelStoreIds = (
    await db.select().from(stores).where(inArray(stores.partnerId, subpartners))
  ).map((store) => store.id);
  const totalSecondLevelPartnerCommission = (await db
    .select({
      totalCommission: sql`SUM(CAST(${sales.secondLevelPartnerCommission} AS numeric))`,
    })
    .from(sales)
    .where(inArray(sales.storeId, secondLevelStoreIds))) as {
    totalCommission: number;
  }[];

  const total = totalSecondLevelPartnerCommission[0]?.totalCommission || 0;
  return total;
}

export async function getAllPartnerFees(partnerId: string) {
  const { stores } = await getStoresByPartnerId(partnerId);
  const secondLevelCommission = await getSecondLevelCommissions(partnerId);
  const firstLevelCommission = stores.reduce(
    (acc, store) => (acc += Number(store.totalFirstLevelCommissions)),
    0
  );

  return {
    firstLevelCommission,
    secondLevelCommission,
    totalCommission: firstLevelCommission + (secondLevelCommission ?? 0),
  };
}