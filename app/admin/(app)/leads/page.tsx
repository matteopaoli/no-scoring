import { getPendingLeads } from "@/app/db";
import { LeadsTable } from "./LeadsTable";

export default async function UsersPage() {
  const leads = await getPendingLeads()

  return (
    <>
      <LeadsTable leads={leads} />
    </>
  );
}
