import { getBusinessTypes } from "@/app/db";
import Client from "./page.client";
import { Box, Flex } from "@chakra-ui/react";
export default async function CreateUserPage() {
  const businessTypes = await getBusinessTypes();
  const businessTypesOptions = businessTypes.map((b) => (
    <option value={b.id}>{b.name}</option>
  ));

  return (
    <Flex
      maxW={{ base: "100%" }}
      w={{ base: "100%", md: "500px" }}
      // mx={{ base: "auto", lg: "0px" }}
      // me="auto"
      h="100%"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      flexDirection="column"
    >
      <Client businessTypesOptions={businessTypesOptions} />
    </Flex>
  );
}
