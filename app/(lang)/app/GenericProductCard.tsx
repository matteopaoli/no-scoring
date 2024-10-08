import { auth } from "@/app/auth";
import CopyTextBox from "@/app/components/copyTextBox/CopyTextBox";
import { getProduct, getUser } from "@/app/db";
import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Stripe from "stripe";

const GenericProductCard = async () => {
  const session = await auth();
  const user = await getUser(session.user.email);

  if (!user.genericProductId) {
    return <Text fontSize="lg">Prodotto generico non disponibile</Text>; // Increased font size
  }

  const product = await getProduct(user.genericProductId);
  const stripe = new Stripe(user.stripeSecretKey);
  const paymentLinkUrl = (await stripe.paymentLinks.retrieve(product.paymentLinkId!)).url;

  return (
    <Box
      p={4}
      bg="gray.100"
      borderRadius="md"
      boxShadow="md"
      maxW="full"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Link di pagamento editabile
      </Text>
      <Text fontSize="lg" mb={4}>
        Questo link permette di inserire qualsiasi cifra e può essere usato per uno o più prodotti contemporaneamente semplicemente inserendo la somma dei prodotti acquistati.
      </Text>
      <Text fontSize="lg" mb={4}>
        Consigliamo di stampare l&apos;etichetta con QR code e posizionarla vicino alla cassa per facilitarne l&apos;utilizzo.
      </Text>
      <Text fontSize="lg" fontWeight="bold">
        Link di Pagamento
      </Text>
      <Box maxW="500px" my="20px">
        <CopyTextBox>{paymentLinkUrl}</CopyTextBox>
      </Box>
      <Text fontSize="lg" fontWeight="bold">
        Immagini
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={4}>
        <Box textAlign="center">
          <VStack spacing={2}>
            <Image
              src={product.qrcode!}
              alt="QRCode"
              height={200}
              width={200}
              objectFit="contain"
            />
            <Text fontWeight="bold">QR Code</Text>
            <Button as="a" href={product.qrcode!} download="qrcode.png" colorScheme="brand">
              Scarica QR Code
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <VStack spacing={2}>
            <Image
              src={user.genericProductSmallImage}
              alt="Small Product"
              height={200}
              width={200}
              objectFit="contain"
            />
            <Text fontWeight="bold">Immagine Piccola</Text>
            <Button as="a" href={user.genericProductSmallImage} download="small_image.png" colorScheme="brand">
              Scarica Immagine Piccola
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <VStack spacing={2}>
            <Image
              src={user.genericProductLargeImage}
              alt="Large Product"
              height={200}
              width={200}
              objectFit="contain"
            />
            <Text fontWeight="bold">Immagine Grande</Text>
            <Button as="a" href={user.genericProductLargeImage} download="large_image.png" colorScheme="brand">
              Scarica Immagine Grande
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default GenericProductCard;
