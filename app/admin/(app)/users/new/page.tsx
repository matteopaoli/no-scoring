import { getAllPartners, getLeadById } from "@/app/db";
import Client from "./page.client";
import { Box, Flex } from "@chakra-ui/react";
import { BusinessTypeService } from "@/app/services/businessTypeService";

export default async function CreateUserPage({ searchParams }: { searchParams: { fromLead?: string } }) {
  const partners = await getAllPartners();
  const businessTypesOptions = await BusinessTypeService.getAllAsComponent()

  let lead = null
  
  if (searchParams.fromLead) {
    lead = await getLeadById(searchParams.fromLead)
  }

  return (
    <Flex
      ml={{ md: "20px" }}
      maxW={{ base: "1000px" }}
      // mx={{ base: "auto", lg: "0px" }}
      // me="auto"
      h="100%"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      flexDirection="column"
    >
      <Client businessTypesOptions={businessTypesOptions} partners={partners} initialData={lead} />
    </Flex>
  );
}
