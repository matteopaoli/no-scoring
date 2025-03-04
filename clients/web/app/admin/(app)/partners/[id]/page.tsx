import { getTotalEarnings } from "@/app/db";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import SubPartnersTable from "./SubPartnersTable";
import { _ADMIN_getSubPartnersByUserId } from "@/app/db";
import Statistics from "./Statistics";
import EditButton from "./EditButton";
import { UserService } from "@/app/services/userService";

export default async function UsersPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const partner = await UserService.getUserById(params.id);
  if (!UserService.isPartner(partner)) {
    throw new Error("not a partner");
  }

  const totalEarnings = await getTotalEarnings(partner.id)
  const subpartners = await _ADMIN_getSubPartnersByUserId(partner.id);
  const subpartnersCount = subpartners?.length ?? 0;

  return (
    <Box px="20px">
      <Flex gap="30px" alignItems="center" mb="30px">
        <Text fontSize="5xl" fontWeight="bold" color="brand.500">
          {partner.firstName} {partner.lastName}
        </Text>
        <EditButton userId={params.id} />
      </Flex>
      <Statistics
        partner={partner}
        subpartners={subpartnersCount}
        totalFee={totalEarnings}
      />
      <Divider mt={8} />
      {partner.role === "partner" && (
        <SubPartnersTable tableData={subpartners} />
      )}
    </Box>
  );
}
