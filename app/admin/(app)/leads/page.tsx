import { getAllPendingUsers  } from "@/app/db";
import PendingMerchantsTable from "./PendingMerchantsTable";

export default async function UsersPage() {
  const merchants = await getAllPendingUsers();

  return (
    <>
      <PendingMerchantsTable merchants={merchants} />
    </>
  );
}
