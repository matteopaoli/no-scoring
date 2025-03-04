import { getPartners } from "@/app/db";
import PartnersTable from "./PartnersTable";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function PartnersPage() {
  const user = await getUserFromAuth();
  const partners = await getPartners(user.id);

  return (
    <>
      <PartnersTable tableData={partners} />
    </>
  )
}
