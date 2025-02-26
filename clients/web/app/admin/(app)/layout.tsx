import { ReactNode } from "react";
import { UserContextProvider } from "@/app/contexts/UserContext";
import Client from "./layout.client";
import { auth } from "@/app/auth";
import Callout from "@/app/components/Callout";
import { UserService } from "@/app/services/userService";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const user = await UserService.getUserByEmail(session?.user?.email!);
  
  return (
    <UserContextProvider value={session}>
      <Client user={user}>
        <Callout autoDismiss={true} dismissDuration={30000} />
        <>{children}</>
      </Client>
    </UserContextProvider>
  );
}
