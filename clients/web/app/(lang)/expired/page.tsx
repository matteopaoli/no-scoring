import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { UserService as User } from "@/app/services/userService";
import { redirect } from "next/navigation";
import { Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import DefaultAuth from "@/app/layouts/admin/Auth";
import Client from './page.client';
export default async function ExpiredPage() {
  const user = await getUserFromAuth();
  if (!user) {
      redirect('/login'); // Redirect if no user is found
  }
  
  if (!(user.role === 'user' && (await User.getStores(user)).every(x => !x.isSubscriptionActive))) {
      redirect('/app')
  }
  return <Client />
}
