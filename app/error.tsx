"use client"

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

const ErrorPage: React.FC = () => {
  const bgColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      p={4}
    >
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl">Qualcosa è andato storto</Heading>
        <Text fontSize="lg">
          Sembra che si sia verificato un errore. Ci scusiamo per il disagio.{" "}
          <br />
          Torna alla nostra homepage per continuare a navigare su{" "}
          <strong>PayTomorrow</strong>.
        </Text>
        <Link href="/">
          <Button colorScheme="brand" size="lg">
            Torna alla Home
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default ErrorPage;
