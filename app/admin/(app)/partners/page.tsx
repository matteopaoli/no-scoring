import { getPartners, getSubPartners } from "@/app/db";
import PartnersTable from "./PartnersTable";
import SubPartnersTable from "./[id]/SubPartnersTable";

export default async function PartnersPage() {
  const partners = await getPartners();
  const subpartners = await getSubPartners();


  return (
    <>
      <PartnersTable tableData={partners} />;
      <SubPartnersTable tableData={subpartners} />
    </>
  )
}
