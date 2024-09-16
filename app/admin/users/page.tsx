import { getUsers } from "@/app/db";
import UsersTable from './UsersTable'
import tableDataDevelopment from "@/app/views/admin/dataTables/variables/tableDataDevelopment.json";
import { columnsDataDevelopment } from "@/app/views/admin/dataTables/variables/columnsData";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <UsersTable
      columnsData={columnsDataDevelopment}
      tableData={users}
    />
  );
}
