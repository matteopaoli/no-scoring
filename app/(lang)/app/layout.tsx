import Client from "./layout.client";
import Callout from "@/app/components/Callout";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromAuth();
  if (!user.onboardingCompleted) {
    redirect("/setup");
  }

  return (
    <Client user={user}>
      <Callout autoDismiss={true} dismissDuration={5000} />
      <>{children}</>
    </Client>
  );
}
