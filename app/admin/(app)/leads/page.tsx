import { getAllPendingUsers  } from "@/app/db";
import PendingMerchantsTable from "./PendingMerchantsTable";

export default async function UsersPage() {
  const merchants = await getAllPendingUsers();
  console.log(merchants)

  return (
    <>
      <PendingMerchantsTable merchants={merchants} />
    </>
  );
}
