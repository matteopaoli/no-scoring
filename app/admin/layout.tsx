import { ReactNode } from "react";
import { UserContextProvider } from "../contexts/UserContext";
import Client from './layout.client'
import { auth } from "../auth";

export default async function AdminLayout({
  children,
  ...rest
}: Record<string, any> & { children: ReactNode }) {
  const session = await auth()
  return (
    // <UserContextProvider
    //   value={session}
    // >
      <Client {...rest}>
        <>{children}</>
      </Client> 
    // </UserContextProvider> 
  );
}
