import { auth } from "@/app/auth";
import { getProduct, getUser } from "@/app/db";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import { products } from "schema";
import Stripe from "stripe";
import GenericProductCard from "./GenericProductCard";

export default async function ProtectedPage() {
  const session = await auth();
  const user = await getUser(session.user.email);
  const stripe = new Stripe(user.stripeSecretKey);
  const stripeGenericProductId = (
    await stripe.products.list({ active: true })
  ).data.find((x) => x.name === "Prodotto generico")?.id;

  console.log(stripeGenericProductId);
  let genericProduct = null;
  if (stripeGenericProductId) {
    genericProduct = await getProduct(stripeGenericProductId);
  }
  console.log(genericProduct);

  return (
    <>
      <Text fontSize="32px">Ciao, {session?.user?.firstName}</Text>
      <GenericProductCard qrCode={genericProduct?.qrcode} />
    </>
  );
}
