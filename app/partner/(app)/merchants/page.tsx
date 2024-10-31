import {
  getStoresByPartnerId,
  getAllPartnerFees,
  getSales,
} from "@/app/db";
import StoresTable from "./StoresTable";
import { InactiveMerchantsTable } from "./InactiveMerchantsTable";
import Statistics from "./Statistics";
import { Box, SimpleGrid } from "@chakra-ui/react";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function MerchantsPage() {
  const user = await getUserFromAuth();
  const { inactiveMerchants, stores } = await getStoresByPartnerId(user.id);
  const { firstLevelCommission, secondLevelCommission, totalCommission } =
    await getAllPartnerFees(user.id);
  const sales = await getSales(user.id, user.role);
  const reducer = (acc: number, sale: Record<string, any>) =>
    (acc += Number(sale.amount));
  const salesVolume = sales?.reduce(reducer, 0) || 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesVolumeThirtyDays =
    sales
      ?.filter((sale) => {
        return sale.createdAt && sale.createdAt >= thirtyDaysAgo; // Filter for sales in the last 30 days
      })
      .reduce(reducer, 0) || 0;

  return (
    <>
      <Statistics
        data={{ firstLevelCommission, secondLevelCommission, totalCommission, salesVolume, salesVolumeThirtyDays }}
      />
      <SimpleGrid>
        <StoresTable stores={stores} />
          {/* <InactiveMerchantsTable merchants={inactiveMerchants} /> */}
      </SimpleGrid>
    </>
  );
}
