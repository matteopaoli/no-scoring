import { drizzle } from "drizzle-orm/postgres-js";
import { eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { businessType, users, commissionRules, stores, userStoreRoles, products, webhookSecrets } from "schema";
import Stripe from "stripe";
import { generateQrCodeWithLogo, generateGenericProductImages } from "./utils/images";
import { createGenericProduct } from "./utils/stripe";

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
  emailVerified: Date;
  image: string | null;
  stripeSecretKey: string;
  role: string;
  businessTypeId: number;
  businessName: string;
  onboardingCompleted: boolean;
  stripeUserId: string;
  stripeLegAccountId: string;
  genericProductId: string;
  genericProductSmallImage: string
  genericProductLargeImage: string
}

export async function getUser(email?: string | null) {
  return (await db.select().from(users).where(eq(users.email, email ?? '')))?.[0] as User;
}

export async function getUserById(id: string) {
  return (await db.select().from(users).where(eq(users.id, id)))?.[0] as User;
}

export async function getUserByStripeAccountId(id: string) {
  return (await db.select().from(users).where(eq(users.stripeUserId, id)))?.[0] as User
}

export async function getWebhookSecret(id: string) {
  return (await db.select().from(webhookSecrets).where(eq(webhookSecrets.accountId, id)))?.[0]
}

export async function createUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string,
  stripeUserId: string,
  stripeLegAccountId: string,
) {
  let salt = genSaltSync(10);
  let hash = hashSync("PayTomorrow!2024", salt);

  const stripe = new Stripe(stripeSecretKey)

  const genericProduct = await createGenericProduct(stripe)

  const webhook = await stripe.webhookEndpoints.create({
    enabled_events: ['checkout.session.completed'],
    url: `https://app.paytomorrow.it/api/stripe/webhook?merchantId=${stripeUserId}`,
  })

  const genericProductQrCode = await generateQrCodeWithLogo(genericProduct.paymentLink.url)
  const { genericProductSmallImage, genericProductLargeImage } = await generateGenericProductImages(genericProductQrCode)

  await db.insert(users).values({
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
    genericProductLargeImage
  });


  await db.insert(products).values({
    id: genericProduct.productId,
    paymentLinkId: genericProduct.paymentLink.id,
    qrcode: genericProductQrCode,
    tagImage: ''
  })

  await db.insert(webhookSecrets).values({
    accountId: stripeUserId,
    secret: webhook.secret
  })
}

export async function updateUser(
  email: string,
  stripeSecretKey: string,
  businessTypeId: number,
  businessName: string,
  stripeUserId: string,
) {
  return await db
    .update(users)
    .set({
      stripeSecretKey,
      businessTypeId,
      businessName,
      stripeUserId
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
        commissionValue: Number(commissionValue),
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
    .where(eq(users.role, 'user'))
    .leftJoin(businessType, eq(users.businessTypeId, businessType.id)) as Omit<User, 'password' | 'role' | 'businessTypeId'>[]
}


export async function updateProfile({
  firstName,
  lastName,
  profileImage,
  email,
  password
}: {
  firstName: string;
  lastName: string;
  profileImage?: Blob | null; // Profilo immagine opzionale
  email: string;
  password?: string
}) {
  // Converti l'immagine in un formato compatibile con il database se necessario
  let profileImageData: string | null = null;
  if (profileImage) {
    // Se hai un modo per gestire le immagini (es. base64, path a file remoto, etc.)
    profileImageData = await convertImageToBase64(profileImage); // Funzione di esempio
  }

  // Esegui l'aggiornamento del profilo nel database
  await db
    .update(users)
    .set({
      firstName,
      lastName,
      image: profileImageData, // Inserisci l'immagine solo se presente
    })
    .where(eq(users.email, email)); // Assumi che l'email sia usata come chiave univoca

    if (password) {
      await updatePassword(password, email)
    }
}

// Esempio di funzione per convertire l'immagine in base64 (opzionale)
async function convertImageToBase64(image: Blob): Promise<string> {
  // Converti il Blob in un Buffer leggibile in Node.js
  const buffer = await image.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  return base64Image;
}

export async function createStore({
  storeName,
  storeLogo,
  email,
}: {
  storeName: string;
  storeLogo: Blob | null;
  email: string;
  userId: number;
  role: string;
}) {
  // Convert logo to base64 if provided
  let logoData: string | null = null;
  if (storeLogo) {
    logoData = await convertImageToBase64(storeLogo);
  }

  // Insert the new store into the database
  const newStore = await db.insert(stores).values({
    name: storeName,
    image: logoData,
  }).returning(); // Optionally return the inserted store details

  // Get the newly created store ID
  const storeId = newStore[0]?.id; // Assuming the store ID is 
  const { id: userId } = await getUser(email)

  // Insert the user-store role association
  if (storeId) {
    await db.insert(userStoreRoles).values({
      userId,
      storeId,
      role: 'admin',
    });
  }

  return { newStore, success: true }; // Return the newly created store and success status
}

export async function completeOnboarding(email: string) {
  return await db
  .update(users)
  .set({
    onboardingCompleted: true
  })
  .where(eq(users.email, email));
}

export async function createBusinessType(bt: BusinessType) {
  // Insert the new business type into the database
  const newBusinessType = await db.insert(businessType).values({
    name: bt.name,
  }).returning();

  // Get the newly created business type ID
  const businessTypeId = newBusinessType[0].id!;

  if (businessTypeId && bt.commissionRules.length > 0) {
    // Insert each commission rule associated with the business type
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

export async function getBusinessTypeById(businessTypeId: number): Promise<BusinessType | null> {
  // Query to fetch the business type along with its commission rules
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
    .leftJoin(commissionRules, eq(commissionRules.businessTypeId, businessType.id))
    .where(eq(businessType.id, businessTypeId));

  // If no business type is found, return null
  if (result.length === 0) {
    return null; 
  }

  // Initialize the business type object with the first result
  const groupedBusinessType: BusinessType = {
    id: result[0].id,
    name: result[0].name,
    commissionRules: []
  };

  // Loop through the results to populate the commission rules
  result.forEach(row => {
    const { commissionRuleId, minAmount, maxAmount, commissionType, commissionValue } = row;

    // Check if the commission rule ID is not null and add it to the commission rules array
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

  return groupedBusinessType; // Return the populated business type object
}


export async function getExistingCommissionRules(businessTypeId: number): Promise<CommissionRule[]> {
  const result = await db
    .select({
      id: commissionRules.id,
      businessTypeId: commissionRules.businessTypeId,
      minAmount: commissionRules.minAmount,
      maxAmount: commissionRules.maxAmount,
      commissionType: commissionRules.commissionType,
      commissionValue: commissionRules.commissionValue
    })
    .from(commissionRules)
    .where(eq(commissionRules.businessTypeId, businessTypeId));

  // Map the result into the CommissionRule array format
  const existingRules: CommissionRule[] = result.map(rule => ({
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

export async function updateBusinessType(businessTypeId: number, data: BusinessTypeUpdateData, cr: CommissionRule[] = []) {
  // Update the business type details
  const updatedBusinessType = await db
    .update(businessType)
    .set({
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    })
    .where(eq(businessType.id, businessTypeId))
    .returning();

  // If there are commission rules, update them
  if (cr.length > 0) {
    // First, delete existing commission rules associated with the business type
    await db.delete(commissionRules).where(eq(commissionRules.businessTypeId, businessTypeId));

    // Insert updated commission rules
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
  return (await db.select().from(products).where(eq(products.id, id)))?.[0]
}

export async function createProduct(product) {
  return await db.insert(products).values(product)
}

export async function updateProduct(productId: string, paymentLinkId: string, qrcode: string, tagImage: string) {
  return await db.update(products).set({ paymentLinkId, qrcode, tagImage }).where(eq(products.id, productId))
}

async function updatePassword(password: string, userEmail: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);
  return await db.update(users).set({ password: hash }).where(eq(users.email, userEmail))
}