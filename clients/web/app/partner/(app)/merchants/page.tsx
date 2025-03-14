import { getSales, getEarningsDetails } from "@/app/db";
import StoresTable from "./StoresTable";
import MerchantsTable from "./MerchantsTable";
import Statistics from "./Statistics";
import { Divider, Flex } from "@chakra-ui/react";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import CreateMerchant from "./CreateMerchant";
import { BusinessTypeService } from "@/app/services/businessTypeService";
import { MerchantService } from "@/app/services/merchantService";
import { AreaService } from "@/app/services/areaService";
import { Store } from "@/app/services/storeService";
import { PartnerService } from "@/app/services/partnerService";

export default async function MerchantsPage() {
  const user = await getUserFromAuth();
  const [businessTypesOptions, regionsOptions, earnings, sales, merchants] =
    await Promise.all([
      BusinessTypeService.getAllAsComponent(),
      AreaService.getRegionsAsComponent(),
      getEarningsDetails(user.id),
      getSales(user.id),
      MerchantService.getMerchantsByPartnerId(user.id)
    ]);
  const directEarnings = earnings
    .filter((x) => !x.sourcePartnerId)
    .map((x) => x.amount)
    .reduce((acc, current) => (acc += Number(current)), 0);
  const indirectEarnings = earnings
    .filter((x) => !!x.sourcePartnerId)
    .map((x) => x.amount)
    .reduce((acc, current) => (acc += Number(current)), 0);
  const totalEarnings = earnings.reduce(
    (acc, current) => (acc += Number(current.amount)),
    0
  );

  let stores = await Store.getStores(
    await PartnerService.getStoresNetwork(user.id),
    user.id
  );
  stores = stores.map((s) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return {
      ...s,
      subscriptionFee: earnings.find(x => x.originStore === s.id && x.type === 'subscriptionFee')?.amount,
      totalVolume: sales
        .filter((x) => x.storeId === s.id)
        .reduce((acc, current) => (acc += Number(current.amount)), 0),
      volumeCurrentMonth: sales
        .filter((x) => x.storeId === s.id)
        .filter((x) => {
          return (
            x.createdAt!.getMonth() === currentMonth &&
            x.createdAt!.getFullYear() === currentYear
          );
        })
        .reduce((acc, current) => (acc += Number(current.amount)), 0),
      totalCommission: earnings
        .filter((x) => x.storeId === s.id)
        .reduce((acc, current) => (acc += Number(current.amount)), 0),
      commissionsCurrentMonth: earnings
        .filter((x) => x.storeId === s.id)
        .filter((x) => {
          return (
            x.createdAt!.getMonth() === currentMonth &&
            x.createdAt!.getFullYear() === currentYear
          );
        })
        .reduce((acc, current) => (acc += Number(current.amount)), 0),
    };
  });

  const reducer = (acc: number, sale: Record<string, any>) =>
    (acc += Number(sale.amount));
  const salesVolume = sales?.reduce(reducer, 0) || 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const salesVolumeStartofMonth =
    sales
      ?.filter((sale) => {
        return sale.createdAt && sale.createdAt >= startOfMonth; // Filter for sales in the last 30 days
      })
      .reduce(reducer, 0) || 0;

  return (
    <>
      <Statistics
        data={{
          firstLevelCommission: directEarnings,
          secondLevelCommission:
            user.role === "partner" ? String(indirectEarnings) : null,
          totalCommission: user.role === "partner" ? totalEarnings : null,
          salesVolume,
          salesVolumeStartofMonth,
        }}
      />
      <Flex justifyContent="end">
        <CreateMerchant
          businessTypesOptions={businessTypesOptions}
          regionsOptions={regionsOptions}
        />
      </Flex>
      <StoresTable stores={stores} />
      <Divider p={10} />
      <MerchantsTable merchants={merchants} />
    </>
  );
}
