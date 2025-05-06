import { and, count, eq, getTableColumns, inArray, or, sql } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import {
  businessType,
  users,
  commissionRules,
  stores,
  userStoreRoles,
  products,
  sales,
  regions,
  areas,
  earnings,
  subscriptions,
  db
} from "@paytomorrow/db";
import { imageToBase64, compressProfileImageToBase64 } from "./utils/images";
import { alias } from "drizzle-orm/pg-core";
import { UserService } from "./services/userService";
import { PartnerService } from "./services/partnerService";
import { randomBytes } from "crypto";

export {
  db
}
interface CommissionRule {
  id: number;
  minAmount: number;
  maxAmount: number | null; // maxAmount can be null for infinite range
  commissionType: string;
  commissionValue: number;
  businessTypeId?: number;
}

export interface BusinessType {
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
  role: string;
  businessTypeId: number;
  businessName: string;
  onboardingCompleted: boolean;
  stripeUserId: string;
  regionId: number;
  regionName: string;
  partnerId?: string;
  onboardingLink: string;
  status: string;
  tosAccepted: boolean;
  tosAcceptedAt: Date | null;
}

export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  referredByUserId: string;
  sector: string;
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
  address,
  lat,
  lng,
  placeId,
}: {
  storeName: string;
  storeLogo: Blob | undefined;
  userId: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}) {
  let logoData: string | null = null;
  if (storeLogo) {
    logoData = await imageToBase64(storeLogo);
  }
  const apiKey = randomBytes(32).toString('hex');
  const newStore = await db
    .insert(stores)
    .values({
      name: storeName,
      image: logoData,
      partnerId: (await UserService.getUserById(userId))?.partnerId,
      address,
      location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)` as any,
      geodata: { lat, lng, placeId },
      apiKey,
    })
    .returning();

  const storeId = newStore[0]?.id;
  if (storeId) {
    await db.insert(userStoreRoles).values({
      userId,
      storeId,
      role: "admin",
    });
    
    await db.insert(subscriptions).values({ storeId })
  }

  return { newStore, success: true };
}

export async function updateStore(
  storeId: string,
  {
    storeName,
    storeLogo,
    address,
    lat,
    lng,
    placeId,
  }: {
    storeName: string;
    storeLogo?: Blob;
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }
) {
  let logoData: string | null = null;
  let updatedStore = null;

  // Start with the basic fields for update.
  const updateData: any = {
    name: storeName,
  };

  // Conditionally update the address, location, and geodata only if provided.
  if (address.trim() !== "" && lng && lat && placeId) {
    updateData.address = address;
    updateData.location = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)` as any;
    updateData.geodata = { lat, lng, placeId };
  }

  // Handle the store logo update if present.
  if (storeLogo && storeLogo.size > 0) {
    logoData = await imageToBase64(storeLogo);
    updateData.image = logoData;
  } else {
    updateData.image = null;  // Clear the image if no logo is provided.
  }

  // Perform the update query.
  updatedStore = await db
    .update(stores)
    .set(updateData)
    .where(eq(stores.id, storeId))
    .returning();

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

  const userStores = await db
    .select()
    .from(userStoreRoles)
    .where(
      and(eq(userStoreRoles.userId, id), eq(userStoreRoles.role, "admin"))
    );

  const storeIds = userStores.map((storeRole) => storeRole.storeId);

  if (storeIds.length > 0) {
    await db
      .delete(userStoreRoles)
      .where(inArray(userStoreRoles.storeId, storeIds));
    await db.delete(stores).where(inArray(stores.id, storeIds));
  }

  await db.delete(products).where(eq(products.userId, id));
  await db.delete(users).where(eq(users.id, id));
}

export async function acceptTOS(userId: string) {
  return await db
    .update(users)
    .set({ tosAccepted: true, tosAcceptedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function getStoreByUserId(userId: string) {
  const result = await db
    .select({
      id: stores.id,
      name: stores.name,
      image: stores.image,
      partnerId: stores.partnerId,
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
}: {
  stripePaymentIntentId: string;
  amount: string;
  storeId: string;
}) {
  return await db.insert(sales).values({
    stripePaymentIntentId,
    amount,
    storeId,
  }).returning()
}

export async function getSales(userId: string) {
    const storeIds = await PartnerService.getStoresNetwork(userId)
    return await db.select().from(sales).where(inArray(sales.storeId, storeIds))
}

export async function getPartners(userId: string) {
  // Get the partner network (list of partner IDs) for the given userId
  const partnerIds = await getPartnerNetwork(userId);

  // Alias the "user" table to represent the parent partner
  const partnerAlias = alias(users, "partner");

  const partners = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      partnerName: sql<string>`CONCAT(${partnerAlias}."firstName", ' ', ${partnerAlias}."lastName")`.as("partnerName"),
      totalCommission: sql`COALESCE(SUM(CAST(${earnings.amount} AS numeric)), 0)`,
    })
    .from(users)
    .leftJoin(partnerAlias, eq(users.partnerId, partnerAlias.id))
    .leftJoin(earnings, eq(earnings.partnerId, users.id))
    .where(inArray(users.id, partnerIds))
    .groupBy(
      users.id,
      users.firstName,
      users.lastName,
      users.email,
      partnerAlias.firstName,
      partnerAlias.lastName
    );

  return partners;
}

export async function createPartner({
  firstName,
  lastName,
  email,
  regionId,
  partnerId,
}: {
  firstName: string,
  lastName: string,
  email: string,
  regionId: number,
  partnerId?: string,
}) {
  const hash = UserService.getDefaultPassword();
  return await db.insert(users).values({
    firstName,
    lastName,
    email,
    regionId,
    role: "partner",
    password: hash,
    partnerId: partnerId ?? null
  });
}

export async function createSubPartner({
  firstName,
  lastName,
  email,
  regionId,
  partnerId,
}: {
  firstName: string,
  lastName: string,
  email: string,
  regionId: number,
  partnerId: string,
}) {
  const hash = UserService.getDefaultPassword();
  return await db.insert(users).values({
    firstName,
    lastName,
    email,
    regionId,
    role: "subpartner",
    password: hash,
    partnerId,
  });
}

export async function updatePartner({
  firstName,
  lastName,
  regionId,
  id,
}: {
  firstName: string,
  lastName: string,
  regionId: number,
  id: string,
}) {
  return await db
    .update(users)
    .set({
      firstName,
      lastName,
      regionId,
    })
    .where(eq(users.id, id));
}
export async function _ADMIN_getSubPartnersByUserId(userId: string) {
  const subpartnerIds = await getPartnerNetwork(userId)
  return await db
  .select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    regionName: regions.name,
    email: users.email,
    totalCommission: sql`COALESCE(SUM(CAST(${earnings.amount} AS numeric)), 0)`,
  })
  .from(users)
  .leftJoin(regions, eq(users.regionId, regions.id))
  .leftJoin(earnings, eq(users.id, earnings.partnerId))
  .leftJoin(stores, eq(earnings.saleId, stores.id))
  .where(inArray(users.id, subpartnerIds))
  .groupBy(
    users.id, 
    users.firstName, 
    users.lastName, 
    regions.name, 
    users.email
  );
}

export async function _PARTNER_getSubPartnersByUserId(userId: string) {
  const subpartnerIds = await getPartnerNetwork(userId);
  
  const subpartners = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      totalCommission: sql`COALESCE(SUM(CAST(${earnings.amount} AS numeric)), 0)`,
      owedFee: sql`
        COALESCE(
          (SELECT SUM(CAST(${earnings.amount} AS numeric))
           FROM ${earnings}
           WHERE ${earnings.partnerId} = ${users.id}),
          0
        )`,
      regionName: regions.name
    })
    .from(users)
    .leftJoin(earnings, eq(earnings.sourcePartnerId, users.id))  // This handles totalCommission
    .leftJoin(regions, eq(regions.id, users.regionId))
    .where(inArray(users.id, subpartnerIds))
    .groupBy(
      users.id,
      users.firstName,
      users.lastName,
      users.email,
      regions.name
    );
  
  return subpartners;
}

export async function searchPartner(query: string) {
  const trimmedQuery = query.trim().toLowerCase();

  if (!trimmedQuery) {
    return [];
  }

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
          sql`LOWER(${users.firstName}) LIKE ${trimmedQuery + "%"}`,
          sql`LOWER(${users.lastName}) LIKE ${trimmedQuery + "%"}`,
          sql`LOWER(${users.email}) LIKE ${trimmedQuery + "%"}`
        ),
        inArray(users.role, ["partner", "subpartner"])
      )
    );
}

export async function getAllPartners(userId: string) {
  const partnerNetwork = await getPartnerNetwork(userId)
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(inArray(users.id, partnerNetwork));
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

export async function getAllPendingUsers(userId: string) {
  const merchantIds = await PartnerService.getMerchantsNetwork(userId);
  const partner = alias(users, "partner");
  return await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      referredByName: sql`CONCAT(${partner.firstName}, ' ', ${partner.lastName})`,
      referredByRole: partner.role,
      phoneNumber: users.phoneNumber,
      onboardingLink: users.onboardingLink, 
      regionName: regions.name,
      name: sql<string>`CASE 
            WHEN ${users.firstName} IS NOT NULL AND ${users.lastName} IS NOT NULL 
            THEN ${users.firstName} || ' ' || ${users.lastName} 
            ELSE ${users.refName} 
          END`,
      leadStatus: users.leadStatus,
      notes: users.notes,
    })
    .from(users)
    .leftJoin(partner, eq(users.partnerId, partner.id))
    .leftJoin(regions, eq(users.regionId, regions.id))
    .where(and(eq(users.status, "pending"), eq(users.role, "user"), inArray(users.id, merchantIds)));
}

// export async function getStoresByPartnerId(
//   partnerId: string,
// ) {
//   const storeIds = await getStoreIdsByPartner(partnerId)

//   const currentMonthFilter = sql`date_trunc('month', ${sales.createdAt}) = date_trunc('month', CURRENT_DATE)`;

//   // Build the select fields object for clarity
//   const fields = {
//     storeId: stores.id,
//     storeName: stores.name,
//     storeImage: stores.image,
//     createdAt: stores.createdAt,
//     totalVolume: sql`COALESCE(SUM(CAST(${sales.amount} AS numeric)), 0)`.as("totalVolume"),
//     volumeCurrentMonth: sql`
//       COALESCE(
//         SUM(
//           CASE WHEN ${currentMonthFilter}
//           THEN CAST(${sales.amount} AS numeric)
//           ELSE 0
//           END
//         ), 0
//       )`.as("totalVolumeCurrentMonth"),
//   };

//   let storesByPartner = (await db
//     .select(fields)
//     .from(stores)
//     .where(inArray(stores.id, storeIds))
//     .leftJoin(sales, eq(sales.storeId, stores.id))
//     .groupBy(stores.id)) as {
//     storeId: string;
//     storeName: string;
//     storeImage: string | null;
//     createdAt: Date | null;
//     totalCommission: number;
//     totalVolume: number;
//     commissionsCurrentMonth: number;
//     volumeCurrentMonth: number;
//   }[];

//   const earnings = await getEarningsDetails(partnerId)
//   const now = new Date();
//   const currentMonth = now.getMonth();
//   const currentYear = now.getFullYear();

//   storesByPartner = storesByPartner.map(x => ({
//     ...x,
//     totalCommission: earnings.filter(y => y.storeId === x.storeId).reduce((acc, current) => acc += Number(current.amount), 0),
//     commissionsCurrentMonth: earnings.filter(y => (y.storeId === x.storeId)).filter(entry => {
//       return (
//         entry.createdAt!.getMonth() === currentMonth &&
//         entry.createdAt!.getFullYear() === currentYear
//       );
//     }).reduce((acc, current) => acc += Number(current.amount), 0)

//   }))

//   return storesByPartner;
// }


export async function getSecondLevelCommissions(
  partnerId: string
): Promise<string | null> {
  const user = await UserService.getUserById(partnerId);
  if (user.role !== "partner") return null;

  const subpartnerIds = (await _ADMIN_getSubPartnersByUserId(partnerId)).map(
    (s) => s.id
  );
  if (!subpartnerIds.length) return "0.00";

  const storeIds = (
    await db
      .select()
      .from(stores)
      .where(inArray(stores.partnerId, subpartnerIds))
  ).map((s) => s.id);
  if (!storeIds.length) return "0.00";

  const [{ totalCommission }] = await db
    .select({
      totalCommission: sql<string>`COALESCE(SUM(${sales.secondLevelPartnerCommission}), 0.00)`,
    })
    .from(sales)
    .where(inArray(sales.storeId, storeIds));

  return totalCommission;
}

export async function getAdmins() {
  return await db.select().from(users).where(eq(users.role, "admin"));
}

export async function deleteLead(userId: string) {
  return await db.delete(users).where(and(eq(users.id, userId), eq(users.status, 'pending')));
}

export async function updateLeadStatus(leadId: string, status: string) {
  return await db.update(users).set({ leadStatus: status }).where(eq(users.id, leadId));
}

// export async function getMerchantsByPartner(partnerId: string) {
//   const partnerNetworkMerchants: string[] = [];
//   const affiliatedUsers = await db
//     .select({ id: users.id, role: users.role })
//     .from(users)
//     .where(eq(users.partnerId, partnerId));

//   for (const affiliatedUser of affiliatedUsers) {
//     if (affiliatedUser.role === 'user')
//     partnerNetworkMerchants.push(affiliatedUser.id);
//     else await getMerchantsByPartner(affiliatedUser.id);
//   }
//   return partnerNetworkMerchants
// };

// export async function getMerchantIdsFromPartnerId(partnerId: string) {
//   const { role } = await UserService.getUserById(partnerId);
//   if (role === 'admin') {
//     return db.select({ id: users.id }).from(users).then(res => res.map(x => x.id))
//   }
//   if (role === 'areamanager') {
//     const areaId = await db
//       .select({ id: areas.id })
//       .from(areas)
//       .where(eq(areas.managerId, partnerId))
//       .then(res => res[0]?.id);
  
//     if (!areaId) {
//       throw new Error("Unauthorized: Area manager not found.");
//     }
  
//     const regionIds = (
//       await db
//         .select({ id: regions.id })
//         .from(regions)
//         .where(eq(regions.areaId, areaId))
//     ).map(region => region.id);
  
//     const directMerchants = (
//       await db
//         .select({ id: users.id })
//         .from(users)
//         .where(eq(users.partnerId, partnerId))
//     ).map(user => user.id);
  
//     const regionMerchants = (
//       await db
//         .select({ id: users.id })
//         .from(users)
//         .where(inArray(users.regionId, regionIds))
//     ).map(user => user.id);
  
//     const partnerNetworkMerchants = await getMerchantsByPartner(partnerId)

//     const allMerchantIds = [...new Set([
//       ...directMerchants,
//       ...regionMerchants,
//       ...partnerNetworkMerchants,
//     ])]
  
//     return allMerchantIds;
//   }
//   if (role === 'partner' || role === 'subpartner') {
//     const merchantIds = await getMerchantsByPartner(partnerId)
//     return merchantIds
//   }
//   throw new Error('unauthorized role')
// }

// export async function getManagedStoreIds(userId: string) {
//   const merchantIds = await getMerchantIdsFromPartnerId(userId);
//   return db.select({ id: stores.id })
//     .from(stores)
//     .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
//     .where(and(eq(userStoreRoles.role, 'admin'), inArray(userStoreRoles.userId, merchantIds)))
//     .then(res => res.map(x => x.id))
// }

export async function getPartnerNetwork(userId: string): Promise<string[]> {
  const user = await UserService.getUserById(userId);
  if (user.role === 'admin') {
    return db.select({ id: users.id }).from(users).where(inArray(users.role, ['partner', 'subpartner'])).then(res => res.map(x => x.id ))
  }
  const partnerNetwork: string[] = [];

  // Recursive function to find all connected partners (partner or subpartner)
  const findPartners = async (partnerId: string) => {
    const affiliatedUsers = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.partnerId, partnerId)); // Find users where partnerId matches

    for (const affiliatedUser of affiliatedUsers) {
      // Check if the user is a partner or subpartner
      if (affiliatedUser.role === 'partner' || affiliatedUser.role === 'subpartner') {
        partnerNetwork.push(affiliatedUser.id);
        // Continue recursion to find their partners
        await findPartners(affiliatedUser.id);
      }
    }
  };

  // Start the recursion with the given userId
  await findPartners(userId);

  return [...new Set(partnerNetwork)];  // Return unique list of partner userIds
}

export async function getAreaManagerId(userId: string | null): Promise<string | null> {
  if (!userId) {
    return null;
  }

  const user = await db
    .select({ id: users.id, partnerId: users.partnerId, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .then(res => res[0]);

  if (!user) {
    return null;
  }

  if (user.role === 'areamanager') {
    return user.id;
  }

  return getAreaManagerId(user.partnerId);
}

export async function getAreaManagerIdByRegion(regionId: number) {
  const areaId = await db
    .select({ areaId: regions.areaId })
    .from(regions)
    .where(eq(regions.id, regionId))
    .limit(1)
    .then(res => res[0].areaId)

  if (!areaId) return null;

  const areaManagerId = await db
    .select({ managerId: areas.managerId })
    .from(areas)
    .where(eq(areas.id, areaId))
    .limit(1)
    .then(res => res[0].managerId);

  if (!areaManagerId) return null;
  return areaManagerId;
}


export async function addEarning({ saleId, partnerId, amount, sourcePartnerId }: { saleId: string, partnerId: string, amount: number, sourcePartnerId?: string }) {
  return await db.insert(earnings).values({ saleId, partnerId, amount: amount.toFixed(2), sourcePartnerId }).returning()
}

export async function getTotalEarnings(userId: string) {
  return await db.select({ amount: earnings.amount })
    .from(earnings)
    .where(eq(earnings.partnerId, userId))
    .then(res => res.map(x => x.amount).reduce((acc, current) => acc += Number(current), 0))
}

export async function getEarningsDetails(userId: string) {
  return await db.select({ amount: earnings.amount, sourcePartnerId: earnings.sourcePartnerId, storeId: stores.id, createdAt: sales.createdAt, type: earnings.type, originStore: earnings.originStore })
    .from(earnings)
    .leftJoin(sales, eq(sales.id, earnings.saleId))
    .leftJoin(stores, eq(sales.storeId, stores.id))
    .where(and(eq(earnings.partnerId, userId)))
}