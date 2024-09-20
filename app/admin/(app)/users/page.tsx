import { getUsers } from "@/app/db";
import UsersTable from "./UsersTable";

export default async function UsersPage() {
  const users = await getUsers();

  return <UsersTable tableData={users} />;
}
