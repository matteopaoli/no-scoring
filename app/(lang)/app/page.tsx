import { Box, Text } from "@chakra-ui/react";
import GenericProductCard from "./GenericProductCard";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function ProtectedPage() {
  const user = await getUserFromAuth();
  return (
    <Box p={4}>
      <Text fontSize="32px" fontWeight="bold" mb={2}>
        Ciao, {user.firstName}!
      </Text>
      <Text fontSize="18px" mb={6}>
        Se hai bisogno di assistenza, non esitare a contattare il nostro team di supporto!
      </Text>
      <GenericProductCard />
    </Box>
  );
}
