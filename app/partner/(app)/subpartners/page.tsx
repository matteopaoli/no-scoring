import { Box } from "@chakra-ui/react";
import { _ADMIN_getSubPartnersByUserId } from "@/app/db";
import SubPartnersTable from "./SubPartnersTable";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function SubPartnersPage() {
  const partner = await getUserFromAuth();
  const subpartners = await _ADMIN_getSubPartnersByUserId(partner.id);

  return (
    <Box px="20px">
      <SubPartnersTable tableData={subpartners} />
    </Box>
  );
}
