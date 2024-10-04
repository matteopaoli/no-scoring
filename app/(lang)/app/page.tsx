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

  return (
    <>
      <Text fontSize="32px">Ciao, {session?.user?.firstName}</Text>
      <GenericProductCard />
    </>
  );
}
