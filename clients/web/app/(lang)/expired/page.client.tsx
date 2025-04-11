'use client'

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import DefaultAuth from "@/app/layouts/admin/Auth";
import logout from "@/app/signout.action";
import { useRouter } from "next/navigation";
export default function ExpiredPageClient() {
  const router = useRouter();
  const handleSignOut = async () => {
    await logout();  // Call the logout function from context
    router.push('/'); // Redirect to the home or login screen after logout
  };
  return (
    <DefaultAuth>
      <Flex
        alignItems="center"
        px={5}
        flexDirection="column"
        justifyContent="center"
        minH="70dvh"
        textAlign="center"
        gap="20px"
      >
        <Heading as="h1">La tua iscrizione a PayTomorrow è scaduta.</Heading>
        <Text as="p">
          Il periodo di prova o il tuo abbonamento a PayTomorrow sono terminati.
          <br />
          Per continuare ad utilizzare PayTomorrow ti invitiamo a rinnovare il
          pagamento.
        </Text>
        <Button
          as="a"
          href="https://secureprivacy.thrivecart.com/paytomorrow-abbonamento"
          variant="solid"
          colorScheme="brand"
        >
          Attiva PayTomorrow
        </Button>
        <Button
          variant="outline"
          colorScheme="brand"
          onClick={handleSignOut}
        >
          Esci
        </Button>
      </Flex>
    </DefaultAuth>
  );
}
