import CopyTextBox from "@/app/components/copyTextBox/CopyTextBox";
import { getProduct } from "@/app/db";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Stripe from "stripe";

const GenericProductCard = async () => {
  const user = await getUserFromAuth();

  if (!user.genericProductId) {
    return <Text fontSize="lg">Prodotto generico non disponibile</Text>; // Increased font size
  }

  const product = await getProduct(user.genericProductId);
  const stripe = new Stripe(user.stripeSecretKey);
  const paymentLinkUrl = (
    await stripe.paymentLinks.retrieve(product.paymentLinkId!)
  ).url;

  return (
    <Box
      p={4}
      bg="gray.100"
      borderRadius="md"
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Link di pagamento editabile
      </Text>
      <Text fontSize="lg" mb={4}>
        Questo link permette di inserire qualsiasi cifra e può essere usato per
        uno o più prodotti contemporaneamente semplicemente inserendo la somma
        dei prodotti acquistati.
      </Text>
      <Text fontSize="lg" mb={4}>
        Consigliamo di stampare l&apos;etichetta con QR code e posizionarla
        vicino alla cassa per facilitarne l&apos;utilizzo.
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
      <SimpleGrid columns={{ base: 1, md: 3 }} mt={4} spacing={24} maxW="600px">
        <VStack spacing={2} justifyContent="flex-end">
          <Image
            src={product.qrcode!}
            alt="QRCode"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Button
            as="a"
            href={product.qrcode!}
            download="qrcode.png"
          >
            <u>Scarica QR Code</u>
          </Button>
        </VStack>
        <VStack spacing={2} justifyContent="flex-end">
          <Image
            src={user.genericProductSmallImage}
            alt="Small Product"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Button
            as="a"
            href={user.genericProductSmallImage}
            download="small_image.png"
          >
            <u>Scarica Immagine Piccola</u>
          </Button>
        </VStack>

        <VStack spacing={2} justifyContent="flex-end">
          <Image
            src={user.genericProductLargeImage}
            alt="Large Product"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Button
            as="a"
            href={user.genericProductLargeImage}
            download="large_image.png"
          >
            <u>Scarica Immagine Grande</u>
          </Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default GenericProductCard;
