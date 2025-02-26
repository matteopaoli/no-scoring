import BusinessTypesTable from "./BusinessTypesTable";
import { BusinessTypeService } from "@/app/services/businessTypeService";

export default async function UsersPage() {
  const businessTypes = await BusinessTypeService.getAll();

  return <BusinessTypesTable tableData={businessTypes} />;
}
