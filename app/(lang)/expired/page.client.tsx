'use client'

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import DefaultAuth from "@/app/layouts/admin/Auth";
export default function ExpiredPageClient() {
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
      </Flex>
    </DefaultAuth>
  );
}
