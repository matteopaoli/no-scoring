import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from 'next/navigation'
import { getSubscriptions } from "@/app/services/subscriptionService";
import SubscriptionsTable from "./SubscriptionsTable";

export default async function Page() {
  const user = await getUserFromAuth();
  if (user.role !== 'admin') {
    redirect('/admin')
  }
  const subscriptions = await getSubscriptions(user.id)
  return (
    <>
        <SubscriptionsTable tableData={subscriptions} />
    </>
  );
}
