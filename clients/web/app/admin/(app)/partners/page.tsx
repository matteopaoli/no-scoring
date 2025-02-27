import { getPartners, getSubPartners } from "@/app/db";
import PartnersTable from "./PartnersTable";
import SubPartnersTable from "./[id]/SubPartnersTable";
import { Divider } from "@chakra-ui/react";

export default async function PartnersPage() {
  const partners = await getPartners();


  return (
    <>
      <PartnersTable tableData={partners} />
    </>
  )
}
