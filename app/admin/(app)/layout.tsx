import { ReactNode } from "react";
import { UserContextProvider } from "@/app/contexts/UserContext";
import Client from "./layout.client";
import { auth } from "@/app/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <UserContextProvider value={session}>
      <Client>
        <>{children}</>
      </Client>
    </UserContextProvider>
  );
}
