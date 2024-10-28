import { Box, Flex, Select, useColorModeValue } from "@chakra-ui/react";
import updatePartner from "./updatePartner.action"; // Assuming this is the action for editing a partner
import { useFormState } from "react-dom";
import Client from './page.client'
import { getUserById, User } from "@/app/db";


export default async function EditPartnerPage(props: { params: Promise<{ partnerId: string }> }) {
  const params = await props.params;
  const partner = await getUserById(params.partnerId)

  return (
    <Client existingPartner={partner} />
  );
}
