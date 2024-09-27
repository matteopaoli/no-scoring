import { getBusinessTypeById, getExistingCommissionRules } from "@/app/db";
import Client from "./page.client";
import { Box, Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function EditBusinessTypePage({ params }: { params: { businessTypeId: string } }) {
  const businessType = await getBusinessTypeById(params.businessTypeId);
  
  if (!businessType) {
    redirect('/admin/business-types?error=true&type=not-found');
  }

  // Fetch commission rules associated with the business type
  const commissionRules = await getExistingCommissionRules(+params.businessTypeId);

  return (
    <Flex
      maxW={{ base: "100%" }}
      w={{ base: "100%", md: "500px" }}
      h="100%"
      alignItems="start"
      justifyContent="center"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      mt={{ base: "40px", md: "14vh" }}
      mx="auto"
      flexDirection="column"
    >
      <Client existingBusinessType={businessType} existingCommissionRules={commissionRules} />
    </Flex>
  );
}
