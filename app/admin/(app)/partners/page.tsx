import { getPartners } from "@/app/db";
import PartnersTable from "./PartnersTable";

export default async function UsersPage() {
  const users = await getPartners();

  return <PartnersTable tableData={users} />;
}
