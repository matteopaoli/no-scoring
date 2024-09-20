import { drizzle } from "drizzle-orm/postgres-js";
import { eq, getTableColumns } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { businessType, users, commissionRules, stores, userStoreRoles } from "schema";

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


export async function updateProfile({
  firstName,
  lastName,
  profileImage,
  email,
}: {
  firstName: string;
  lastName: string;
  profileImage?: Blob | null; // Profilo immagine opzionale
  email: string;
}) {
  // Converti l'immagine in un formato compatibile con il database se necessario
  let profileImageData: string | null = null;
  if (profileImage) {
    // Se hai un modo per gestire le immagini (es. base64, path a file remoto, etc.)
    profileImageData = await convertImageToBase64(profileImage); // Funzione di esempio
  }

  // Esegui l'aggiornamento del profilo nel database
  return await db
    .update(users)
    .set({
      firstName,
      lastName,
      image: profileImageData, // Inserisci l'immagine solo se presente
    })
    .where(eq(users.email, email)); // Assumi che l'email sia usata come chiave univoca
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