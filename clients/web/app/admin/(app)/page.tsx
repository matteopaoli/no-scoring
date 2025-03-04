import { getEarningsDetails, getSales, getTotalEarnings } from "@/app/db";
import Statistics from "./Statistics";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import StoresTable from "./StoresTable";
import { MerchantService } from "@/app/services/merchantService";
import { UserService } from "@/app/services/userService";
import TempMigrateButton from "./TEMPMigrateButton";
import { Store } from "@/app/services/storeService";
import { PartnerService } from "@/app/services/partnerService";

export default async function Page() {
  const user = await getUserFromAuth();
  const [stores, merchants, totalEarnings] = await Promise.all([
    Store.getStores(await PartnerService.getStoresNetwork(user.id), user.id),
    MerchantService.getAllActiveMerchants(user.id),
    getTotalEarnings(user.id),
  ]);
    const sales = await getSales(user.id)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const earnings = (await getEarningsDetails(user.id))
      .reduce((acc, current) => {
        const storeId = current.storeId!;
        const amount = Number(current.amount);
    
        // Initialize if not present
        if (!acc[storeId]) {
          acc[storeId] = { totalCommission: 0, commissionsCurrentMonth: 0 };
        }
    
        // Add to totalCommission
        acc[storeId].totalCommission += amount;
    
        // Add to commissionsCurrentMonth if it's in the current month
        if (current.createdAt!.getMonth() === currentMonth && current.createdAt!.getFullYear() === currentYear) {
          acc[storeId].commissionsCurrentMonth += amount;
        }
    
        return acc;
      }, {} as Record<string, { totalCommission: number; commissionsCurrentMonth: number }>);
    
    const merged = stores.map(store => ({
      totalCommission: earnings[store.id]?.totalCommission || 0,
      commissionsCurrentMonth: earnings[store.id]?.commissionsCurrentMonth || 0,
      totalVolume: sales
      .filter((x) => x.storeId === store.id)
      .reduce((acc, current) => (acc += Number(current.amount)), 0),
      volumeCurrentMonth: sales
      .filter((x) => x.storeId === store.id)
      .filter((x) => {
        return (
          x.createdAt!.getMonth() === currentMonth &&
          x.createdAt!.getFullYear() === currentYear
        );
      })
      .reduce((acc, current) => (acc += Number(current.amount)), 0),
      ...store
    }));

  return (
    <>
      <Statistics merchants={merchants} revenue={totalEarnings ?? 0} />
      <StoresTable stores={merged} canDisable={UserService.isAdmin(user)} />
      <TempMigrateButton />
    </>
  );
}
