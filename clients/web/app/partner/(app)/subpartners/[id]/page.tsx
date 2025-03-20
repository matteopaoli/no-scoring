import { getEarningsDetails, getSales } from "@/app/db";
import { Box, Divider, Text } from "@chakra-ui/react";
import { _ADMIN_getSubPartnersByUserId } from "@/app/db";
import Statistics from "./Statistics";
import { UserService } from "@/app/services/userService";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";
import StoresTable from "./StoresTable";
import { PartnerService } from "@/app/services/partnerService";
import { Store } from "@/app/services/storeService";

export default async function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserFromAuth();
  const agent = await UserService.getUserById(params.id);
  if (!UserService.isPartner(agent)) {
    throw new Error("not a partner");
  }
  if (agent.partnerId !== user.id) {
    redirect("/subpartners?error=true&action=unauthorized");
  }

  const stores = await Store.getStores(
    await PartnerService.getStoresNetwork(agent.id)
  );
  const sales = await getSales(user.id);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const earningsReducer = (acc, current) => {
    const storeId = current.storeId!;
    const amount = Number(current.amount);

    // Initialize if not present
    if (!acc[storeId]) {
      acc[storeId] = { totalCommission: 0, commissionsCurrentMonth: 0 };
    }

    // Add to totalCommission
    acc[storeId].totalCommission += amount;

    // Add to commissionsCurrentMonth if it's in the current month
    if (
      current.createdAt!.getMonth() === currentMonth &&
      current.createdAt!.getFullYear() === currentYear
    ) {
      acc[storeId].commissionsCurrentMonth += amount;
    }

    return acc;
  };

  const earnings = (await getEarningsDetails(user.id))
    .filter((x) => x.sourcePartnerId === agent.id)
    .reduce(
      earningsReducer,
      {} as Record<
        string,
        { totalCommission: number; commissionsCurrentMonth: number }
      >
    );

  const agentEarnings = (await getEarningsDetails(params.id)).reduce(
    earningsReducer,
    {} as Record<
      string,
      { totalCommission: number; commissionsCurrentMonth: number }
    >
  );

  const merged = stores.map((store) => ({
    totalCommission: earnings[store.id]?.totalCommission || 0,
    owedFee: agentEarnings[store.id]?.totalCommission || 0,
    owedFeeCurrentMonth:
      agentEarnings[store.id]?.commissionsCurrentMonth || 0,
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
    ...store,
  }));

  const totalEarnings = merged.reduce(
    (acc, current) => (acc += current.totalCommission),
    0
  );

  return (
    <Box px="20px">
      {/* <Flex gap="30px" alignItems="center" mb="30px"> */}
      <Text fontSize="5xl" fontWeight="bold" color="brand.500">
        {agent.firstName} {agent.lastName}
      </Text>
      {/* </Flex> */}
      <Statistics
        partner={agent}
        stores={stores.length}
        totalFee={totalEarnings}
        owedFee={Object.values(agentEarnings).reduce((acc, current) => (acc += current?.totalCommission), 0)}
      />
      <Divider mt={8} />
      <StoresTable stores={merged} />
    </Box>
  );
}
