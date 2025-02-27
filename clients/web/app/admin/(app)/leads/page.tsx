import { getAllPendingUsers  } from "@/app/db";
import PendingMerchantsTable from "./PendingMerchantsTable";
import Statistics from "./Statistics";

export default async function UsersPage() {
  const merchants = await getAllPendingUsers();

  return (
    <>
      <Statistics merchants={merchants.length} />
      <PendingMerchantsTable merchants={merchants} />
    </>
  );
}
