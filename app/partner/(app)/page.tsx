import { getAllMerchants, getSales } from "@/app/db";
import { redirect } from "next/navigation";
import Statistics from "./Statistics";
import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { auth } from "@/app/auth";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function Page() {
  // const session = await auth()
  // const user = await UserService.getUserByEmail(session?.user?.email)
  const user = await getUserFromAuth()
  redirect('/partner/merchants')
  // const merchants = await getAllMerchants();
  // const sales = await getSales(user.id, user.role)
  // return (
  //   <>
  //   Welcome!
  //     {/* <Statistics merchants={merchants} /> */}
  //   </>
  // );
}
