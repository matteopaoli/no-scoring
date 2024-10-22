import { getAllPartnerFees, getUserById } from "@/app/db";
import { Box, Flex, Icon, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import SubPartnersTable from "./SubPartnersTable";
import { getSubPartnersByUserId } from "@/app/db";
import Statistics from "./Statistics";
import { MdOutlineEdit } from "react-icons/md";
import EditButton from "./EditButton";

export default async function UsersPage({
  params,
}: {
  params: { id: string };
}) {
  const partner = await getUserById(params.id);
  if (partner.role !== "partner") {
    throw new Error("not a partner");
  }

  const subpartners = await getSubPartnersByUserId(partner.id);
  const { totalCommission } = await getAllPartnerFees(partner.id)

  return (
    <Box px="20px">
      <Flex gap="30px" alignItems="center" mb="30px">
        <Text fontSize="5xl" fontWeight="bold" color="brand.500">
          {partner.firstName} {partner.lastName}
        </Text>
        <EditButton userId={params.id} />
      </Flex>
      <Statistics partner={partner} subpartners={subpartners.length} totalFee={totalCommission} />
      <SubPartnersTable tableData={subpartners} />
    </Box>
  );
}
