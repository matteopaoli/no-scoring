import { Box } from "@chakra-ui/react";
import { getSubPartnersByUserId } from "@/app/db";
import SubPartnersTable from "./SubPartnersTable";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function SubPartnersPage() {
  const partner = await getUserFromAuth();
  const subpartners = await getSubPartnersByUserId(partner.id);

  return (
    <Box px="20px">
      <SubPartnersTable tableData={subpartners} />
    </Box>
  );
}
