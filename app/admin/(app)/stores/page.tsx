import { auth } from "@/app/auth";
import { getSales, getUser, getAllStoresWithLegCommission } from "@/app/db";
import Statistics from "./Statistics";
import StoresTable from "@/app/partner/(app)/merchants/StoresTable";

export default async function MerchantsPage() {
  const session = await auth();
  const user = await getUser(session?.user?.email);
  const sales = await getSales(user.id, user.role);

  interface Accumulator {
    legRevenue: number;
    salesVolume: number;
  }

  const { legRevenue, salesVolume } = sales?.reduce<Accumulator>(
    (obj, sale) => ({
      legRevenue: obj.legRevenue + Number(sale.legCommission),
      salesVolume: obj.salesVolume + Number(sale.amount),
    }),
    { legRevenue: 0, salesVolume: 0 }
  ) || { legRevenue: 0, salesVolume: 0 };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { legRevenue: totalCommissionThirtyDays, salesVolume: salesVolumeThirtyDays } = sales
    ?.filter((sale) => {
      return sale.createdAt && sale.createdAt >= thirtyDaysAgo; // Filter for sales in the last 30 days
    })
    .reduce<Accumulator>(
      (obj, sale) => ({
        legRevenue: obj.legRevenue + Number(sale.legCommission),
        salesVolume: obj.salesVolume + Number(sale.amount),
      }),
      { legRevenue: 0, salesVolume: 0 }
    ) || { legRevenue: 0, salesVolume: 0 };

  const stores = await getAllStoresWithLegCommission();
  return (
    <>
      <Statistics data={{ totalCommission: legRevenue, volume: salesVolume, totalCommissionThirtyDays, salesVolumeThirtyDays }} />
      <StoresTable stores={stores} />
    </>
  );
}
