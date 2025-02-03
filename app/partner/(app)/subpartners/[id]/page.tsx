import { getAllPartnerFees, getStoresByPartnerId } from "@/app/db";
import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { _ADMIN_getSubPartnersByUserId } from "@/app/db";
import Statistics from "./Statistics";
import { UserService } from "@/app/services/userService";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";
import StoresTable from "./StoresTable";

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserFromAuth();
  const agent = await UserService.getUserById(params.id);
  if (!UserService.isPartner(agent)) {
    throw new Error("not a partner");
  }
  if (agent.partnerId !== user.id) {
    redirect('/subpartners?error=true&action=unauthorized')
  }
  const stores = await getStoresByPartnerId(agent.id, true)
  const totalEarnings = stores.reduce((acc, store) => acc += Number(store.totalCommission), 0)
  // const subpartners = await _ADMIN_getSubPartnersByUserId(partner.id)
  // const subpartnersCount = subpartners?.length ?? 0;
  // const { totalCommission } = await getAllPartnerFees(partner.id);

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
      />
      <Divider mt={8} />
      <StoresTable stores={stores} />
    </Box>
  );
}
