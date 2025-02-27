import CopyTextBox from "@/app/components/copyTextBox/CopyTextBox";
import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";

const DownloadSigns = async () => {
  return (
    <Box p={4} bg="gray.100" borderRadius="md" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        Immagini
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} mt={4} spacing={24} maxW="600px" pl={{ md: '50px' }}>
        <VStack spacing={2} justifyContent="flex-end">
          <Image
            src="/img/large-sign.png"
            alt="Etichetta 1"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Button
            as="a"
            href="/img/large-sign.png"
            download="paytomorrow-etichetta-grande.png"
          >
            <u>Scarica Etichetta Grande</u>
          </Button>
        </VStack>
        <VStack spacing={2} justifyContent="flex-end">
          <Image
            src="/img/small-sign.png"
            alt="Etichetta 1"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Button
            as="a"
            href="/img/small-sign.png"
            download="paytomorrow-etichetta-grande.png"
          >
            <u>Scarica Etichetta Piccola</u>
          </Button>
        </VStack>
      </SimpleGrid>
      <Text fontSize="lg" my={4}>
        Consigliamo di stampare l&apos;etichetta e posizionarla vicino alla
        cassa.
      </Text>
    </Box>
  );
};

export default DownloadSigns;
