import { db } from "../db"; // Adjust the import based on your project setup
import { sales, earnings, stores } from "../../schema"; // Adjust based on your schema structure
import { eq } from "drizzle-orm";
import { Store } from "./storeService";
import { UserService } from "./userService";
import Stripe from "stripe";

export async function migrateEarnings() {
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId) {
    throw new Error("ADMIN_USER_ID is not set in environment variables");
  }

  const allSales = await db.select().from(sales);

  for (const sale of allSales) {
    const { id: saleId, storeId, legCommission, firstLevelPartnerCommission, secondLevelPartnerCommission } = sale;

    // Insert earning for the admin
    await db.insert(earnings).values({
      saleId,
      partnerId: adminUserId,
      amount: legCommission,
    });

    const merchant = await Store.getAdminUser(storeId)
    if (!merchant || !merchant.partnerId) continue;

    // First level partner
    await db.insert(earnings).values({
      saleId,
      partnerId: merchant.partnerId,
      amount: firstLevelPartnerCommission,
    });

    const partner = await UserService.getUserById(merchant.partnerId);

    if (partner.partnerId) {
        await db.insert(earnings).values({
          saleId,
          partnerId: partner.partnerId,
          amount: secondLevelPartnerCommission,
          sourcePartnerId: partner.id
        });

    }
  }

  console.log("Earnings migration completed successfully.");
}
