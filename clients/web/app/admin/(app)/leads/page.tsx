import { getAllPendingUsers  } from "@/app/db";
import PendingMerchantsTable from "./PendingMerchantsTable";
import Statistics from "./Statistics";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function UsersPage() {
  const user = await getUserFromAuth();
  const merchants = await getAllPendingUsers(user.id);

  return (
    <>
      <Statistics merchants={merchants.length} />
      <PendingMerchantsTable merchants={merchants} />
    </>
  );
}
