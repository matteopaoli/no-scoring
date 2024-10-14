import { auth } from "@/app/auth";
import { Box, Text } from "@chakra-ui/react";
import GenericProductCard from "./GenericProductCard";

export default async function ProtectedPage() {
  const session = await auth();

  return (
    <Box p={4}>
      <Text fontSize="32px" fontWeight="bold" mb={2}>
        Ciao, {session?.user?.firstName}!
      </Text>
      <Text fontSize="18px" mb={6}>
        Se hai bisogno di assistenza, non esitare a contattare il nostro team di supporto!
      </Text>
      <GenericProductCard />
    </Box>
  );
}
