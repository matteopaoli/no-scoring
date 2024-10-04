import { auth } from "@/app/auth";
import { getProduct, getUser } from "@/app/db";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";

const GenericProductCard = async () => {
  
  const session = await auth();
  const user = await getUser(session.user.email);
  
  if (!user.genericProductId) {
    return <Text>Prodotto generico non disponibile</Text>;
  }

  const product = await getProduct(user.genericProductId);
  return (
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

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Image
          src={product.qrcode!}
          alt="qrcode"
          width={400}
          height={400}
          objectFit="cover"
        />
        {/* <Image
          src={user.genericProductSmallImage}
          alt="small image"
          width={400}
          height={400}
          objectFit="cover"
        />
        <Image
          src={user.genericProductLargeImage}
          alt="large image"
          width={400}
          height={400}
          objectFit="cover"
        /> */}
      </SimpleGrid>
    </Box>
  );
};

export default GenericProductCard;
