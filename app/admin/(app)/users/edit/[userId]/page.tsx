import { getBusinessTypes } from "@/app/db";
import Client from "./page.client";
import { Box, Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { UserService } from "@/app/services/userService";

export default async function CreateUserPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const businessTypes = await getBusinessTypes();
  const user = await UserService.getUserById(params.userId)

  if (!user) {
    redirect('/admin/users?error=true&type=not-found')
  }

  const businessTypesOptions = businessTypes.map((b) => (
    <option value={b.id} key={b.id}>{b.name}</option>
  ));

  return (
    <Flex
      maxW={{ base: "100%" }}
      w={{ base: "100%", md: "500px" }}
      // mx={{ base: "auto", lg: "0px" }}
      // me="auto"
      h="100%"
      alignItems="start"
      justifyContent="center"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      mt={{ base: "40px", md: "14vh" }}
      mx="auto"
      flexDirection="column"
    >
      <Client businessTypesOptions={businessTypesOptions} existingUser={user} />
    </Flex>
  );
}
