import { getStoresByPartnerId, getAllPartnerFees, getSales } from "@/app/db";
import StoresTable from "./StoresTable";
import MerchantsTable from "./MerchantsTable";
import Statistics from "./Statistics";
import { Divider, Flex } from "@chakra-ui/react";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import CreateMerchant from "./CreateMerchant";
import { BusinessTypeService } from "@/app/services/businessTypeService";
import { MerchantService } from "@/app/services/merchantService";

export default async function MerchantsPage() {
  const user = await getUserFromAuth();
  const stores = await getStoresByPartnerId(user.id);
  const merchants = await MerchantService.getMerchantsByPartnerId(user.id);
  const businessTypesOptions = await BusinessTypeService.getAllAsComponent();

  const { firstLevelCommission, secondLevelCommission, totalCommission } =
    await getAllPartnerFees(user.id);
  const sales = await getSales(user.id, user.role);
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
          firstLevelCommission,
          secondLevelCommission: user.role === "partner" ? secondLevelCommission : null,
          totalCommission: user.role === "partner" ? totalCommission : null,
          salesVolume,
          salesVolumeStartofMonth,
        }}
      />
      <Flex justifyContent="end">
        <CreateMerchant businessTypesOptions={businessTypesOptions} />
      </Flex>
      <StoresTable stores={stores} />
      <Divider p={10} />
      <MerchantsTable merchants={merchants} />
    </>
  );
}
