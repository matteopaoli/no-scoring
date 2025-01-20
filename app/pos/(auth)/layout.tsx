import Client from "./layout.client";
import Callout from "@/app/components/Callout";
import { UserService } from "@/app/services/userService";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { Box } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import Footer from "../../components/footer/FooterAdmin";

export default async function PosAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getUserFromAuth();
  
    if (!["user", "pos"].includes(user.role)) redirect("/login");
  
    if (
      (await UserService.getStores(user)).every((x) => !x.isSubscriptionActive)
    ) {
      redirect("/expired");
    }
  
    return (
      <Client user={user}>
        <Callout autoDismiss={true} dismissDuration={5000} />
        <>{children}</>
      </Client>
    );
  }
  catch {
    redirect('/pos/login');
  }
}
