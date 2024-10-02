import { auth } from "@/app/auth";
import { getProduct, getUser } from "@/app/db";
import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import { products } from "schema";
import Stripe from "stripe";

export default async function ProtectedPage() {
  const session = await auth();
  const user = await getUser(session.user.email)
  const stripe = new Stripe(user.stripeSecretKey)
  const stripeGenericProductId = (await stripe.products.list({ active: true })).data.find(x => x.name === 'Prodotto generico')?.id
  console.log("POOOO", stripeGenericProductId)
  if (!stripeGenericProductId) {
    throw new Error()
  }

  const genericProduct = await getProduct(stripeGenericProductId)

  return (
    <>
      <Text fontSize="32px">Ciao, {session?.user?.firstName}</Text>
      <Box>
        <Text>Prodotto generico</Text>
        <Image src={`${genericProduct.qrcode}`} alt="qrcode" width={400} height={400} />
      </Box>
    </>
  );
}
