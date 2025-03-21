import { subscriptions as subscriptionsTable, stores as storesTable, users, earnings, db } from "@paytomorrow/db";
import { PartnerService } from "./partnerService";
import { and, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getSubscriptions(userId: string) {
  const stores = await PartnerService.getStoresNetwork(userId);

  // Alias for the partner manager (i.e., the user whose id matches stores.partnerId)
  const managerAlias = alias(users, "manager");
  
  const subscriptions = await db.select({
    id: subscriptionsTable.id,
    storeId: storesTable.id,
    storeName: storesTable.name,
    amount: subscriptionsTable.amount,
    partnerFee: subscriptionsTable.partnerFee,
    upperPartnerFee: subscriptionsTable.upperPartnerFee,
    partnerId: storesTable.partnerId,
    upperPartnerId: managerAlias.id,
    partnerName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`.mapWith(String).as("partnerName"),
    upperPartnerName: sql<string>`CONCAT(${managerAlias.firstName}, ' ', ${managerAlias.lastName})`.mapWith(String).as("partnerManagerName"),
  })
  .from(subscriptionsTable)
  .leftJoin(storesTable, eq(subscriptionsTable.storeId, storesTable.id))
  .leftJoin(users, eq(users.id, storesTable.partnerId)) // Joins the partner (store.partnerId → users.id)
  .leftJoin(managerAlias, eq(managerAlias.id, users.partnerId)) // Fix: Get the partnerManagerId from users
  .where(inArray(subscriptionsTable.storeId, stores));
  
  return subscriptions;
}

export async function getSubscriptionById(subscriptionId: string) {
  return (await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.id, subscriptionId)))?.[0]
}

export async function addSubscriptionAmount(subscriptionId: string, amount: number) {
  const { storeId } = await getSubscriptionById(subscriptionId)
  await db.update(subscriptionsTable).set({ amount: amount.toFixed(2) }).where(eq(subscriptionsTable.id, subscriptionId))
  const existingEarning = (await db.select().from(earnings).where(and(eq(earnings.originStore, storeId), eq(earnings.type, 'subscriptionFee'), eq(earnings.partnerId, process.env.ADMIN_USER_ID!))))[0]
  if (!existingEarning) {
    await db.insert(earnings).values({
      amount: amount.toFixed(2),
      originStore: storeId,
      type: 'subscriptionFee',
      partnerId: process.env.ADMIN_USER_ID,
    })
  }
  else await db.update(earnings).set({ amount: amount.toFixed(2) }).where(eq(earnings.id, existingEarning.id))
}

export async function addPartnerFeeAmount(subscriptionId: string, amount: number, partnerId: string) {
  const { storeId } = await getSubscriptionById(subscriptionId)
  await db.update(subscriptionsTable).set({ partnerFee: amount.toFixed(2) }).where(eq(subscriptionsTable.id, subscriptionId))
  const existingEarning = (await db.select().from(earnings).where(and(eq(earnings.originStore, storeId), eq(earnings.type, 'subscriptionFee'), eq(earnings.partnerId, partnerId))))[0]
  if (!existingEarning) {
    await db.insert(earnings).values({
      amount: amount.toFixed(2),
      originStore: storeId,
      type: 'subscriptionFee',
      partnerId,
    })
  }
  else await db.update(earnings).set({ amount: amount.toFixed(2) }).where(eq(earnings.id, existingEarning.id))
}

export async function addUpperPartnerFeeAmount(subscriptionId: string, amount: number, partnerId: string) {
  const { storeId } = await getSubscriptionById(subscriptionId)
  await db.update(subscriptionsTable).set({ upperPartnerFee: amount.toFixed(2) }).where(eq(subscriptionsTable.id, subscriptionId))
  const existingEarning = (await db.select().from(earnings).where(and(eq(earnings.originStore, storeId), eq(earnings.type, 'subscriptionFee'), eq(earnings.partnerId, partnerId))))[0]
  if (!existingEarning) {
    await db.insert(earnings).values({
      amount: amount.toFixed(2),
      originStore: storeId,
      type: 'subscriptionFee',
      partnerId,
    })
  }
  else await db.update(earnings).set({ amount: amount.toFixed(2) }).where(eq(earnings.id, existingEarning.id))
}

