import { getUser } from "@/app/db";
import { Box } from "@chakra-ui/react";
import { getSubPartnersByUserId } from "@/app/db";
import { auth } from "@/app/auth";
import SubPartnersTable from "./SubPartnersTable";

export default async function SubPartnersPage() {
  const session = await auth()
  const partner = await getUser(session?.user?.email);
  const subpartners = await getSubPartnersByUserId(partner.id);

  return (
    <Box px="20px">
      <SubPartnersTable tableData={subpartners} />
    </Box>
  );
}
