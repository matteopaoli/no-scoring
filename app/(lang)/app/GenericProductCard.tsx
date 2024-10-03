import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";

const GenericProductCard = ({ qrCode }: { qrCode?: string | null }) => (
  qrCode ? (
  <Box
    p={4}
    bg="gray.100"
    borderRadius="md"
    boxShadow="md"
    maxW="sm"
    mx="auto"
  >
    <Text fontSize="xl" fontWeight="bold" mb={4}>
      Prodotto generico
    </Text>

    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      <Image
        src={qrCode}
        alt="qrcode"
        width={400}
        height={400}
        objectFit="cover"
      />
      <Image
        src={qrCode}
        alt="qrcode"
        width={400}
        height={400}
        objectFit="cover"
      />
    </SimpleGrid>
  </Box>
  ) : <Text>Prodotto generico non disponibile</Text>
);

export default GenericProductCard