import { ReactNode } from "react";
import { UserContextProvider } from "../../contexts/UserContext";
import Client from "./layout.client";
import { auth } from "@/app/auth";
import { getUser } from "@/app/db";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
  ...rest
}: Record<string, any> & { children: ReactNode }) {
  const session = await auth();
  const user = await getUser(session!.user!.email!);
  if (!user.onboardingCompleted) {
    redirect("/setup");
  }

  return (
    <Client {...rest}>
      <>{children}</>
    </Client>
  );
}
