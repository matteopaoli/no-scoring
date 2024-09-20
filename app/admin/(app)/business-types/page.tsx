import { getBusinessTypes } from "@/app/db";
import BusinessTypesTable from "./BusinessTypesTable";

export default async function UsersPage() {
  const businessTypes = await getBusinessTypes();

  return <BusinessTypesTable tableData={businessTypes} />;
}
