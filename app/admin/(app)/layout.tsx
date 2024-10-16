import { ReactNode } from "react";
import { UserContextProvider } from "@/app/contexts/UserContext";
import Client from "./layout.client";
import { auth } from "@/app/auth";
import { getUser } from "@/app/db";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const user = await getUser(session?.user?.email)
  return (
    <UserContextProvider value={session}>
      <Client user={user}>
        <>{children}</>
      </Client>
    </UserContextProvider>
  );
}
