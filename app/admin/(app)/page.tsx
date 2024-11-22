import { getAllStores, getSales } from "@/app/db";
import Statistics from "./Statistics";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import StoresTable from "@/app/partner/(app)/merchants/StoresTable";
import { MerchantService } from "@/app/services/merchantService";

export default async function Page() {
  const user = await getUserFromAuth();
  const stores = await getAllStores();
  const merchants = await MerchantService.getAllActiveMerchants();
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
