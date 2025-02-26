import Client from "./page.client";
import { Box, Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { UserService } from "@/app/services/userService";
import { BusinessTypeService } from "@/app/services/businessTypeService";

export default async function CreateUserPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const businessTypes = await BusinessTypeService.getAll();
  const user = await UserService.getUserById(params.userId)

  if (!user) {
    redirect('/admin/users?error=true&type=not-found')
  }

  const businessTypesOptions = businessTypes.map((b) => (
    <option value={b.id} key={b.id}>{b.name}</option>
  ));

  return (
    <Flex
      background="white"
      p={{ base: "20px", md: "40px" }}
      maxW={{ base: "100%" }}
      w={{ base: "100%", md: "500px" }}
      borderRadius="lg"
      // mx={{ base: "auto", lg: "0px" }}
      // me="auto"
      h="100%"
      mb={{ base: "30px", md: "60px" }}
      // px={{ base: "25px", md: "0px" }}
    >
      <Client businessTypesOptions={businessTypesOptions} existingUser={user} />
    </Flex>
  );
}
