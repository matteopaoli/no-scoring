import { getAllMerchants, getSales, getUser } from "@/app/db";
import { redirect } from "next/navigation";
import Statistics from "./Statistics";
import UserGrowthChart from "./user-growth-chart/UserGrowthChartCard";
import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { auth } from "@/app/auth";

export default async function Page() {
  const session = await auth()
  const user = await getUser(session?.user?.email)

  const merchants = await getAllMerchants();
  const sales = await getSales(user.id, user.role)
  return (
    <>
      <Statistics merchants={merchants} />
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <UserGrowthChart data={merchants} />
      </SimpleGrid>
    </>
  );
}
