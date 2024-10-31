import { getAllMerchants, getSales } from "@/app/db";
import Statistics from "./Statistics";
import UserGrowthChart from "./user-growth-chart/UserGrowthChartCard";
import { SimpleGrid } from "@chakra-ui/react";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function Page() {
  const user = await getUserFromAuth();

  const merchants = await getAllMerchants();
  const sales = await getSales(user.id, user.role)
  const legRevenue = sales?.reduce((acc, sale) => acc += Number(sale.legCommission) ?? 0, 0)
  return (
    <>
      <Statistics merchants={merchants} revenue={legRevenue} />
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <UserGrowthChart data={merchants} />
      </SimpleGrid>
    </>
  );
}
