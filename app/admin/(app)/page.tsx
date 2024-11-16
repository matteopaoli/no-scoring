import { getAllMerchants, getAllStores, getSales } from "@/app/db";
import Statistics from "./Statistics";
import UserGrowthChart from "./user-growth-chart/UserGrowthChartCard";
import { Divider, GridItem, SimpleGrid } from "@chakra-ui/react";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import StoresTable from "@/app/partner/(app)/merchants/StoresTable";
import MerchantsTable from "@/app/partner/(app)/merchants/MerchantsTable";

export default async function Page() {
  const user = await getUserFromAuth();
  const stores = await getAllStores();
  const merchants = await getAllMerchants();
  const sales = await getSales(user.id, user.role);
  const legRevenue = sales?.reduce(
    (acc, sale) => (acc += Number(sale.legCommission) ?? 0),
    0
  );

  return (
    <>
      <Statistics merchants={merchants} revenue={legRevenue} />
      {/* <Flex justifyContent="end">
      </Flex> */}
      <StoresTable stores={stores} />
    </>
  );
}
