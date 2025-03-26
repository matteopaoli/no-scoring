"use client";
import React from "react";
// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "@/app/layouts/admin/Auth";
import { Link } from "@chakra-ui/next-js";
import SubmitButton from "@/app/components/SubmitButton";

export default function ForgotPassword() {
  const toast = useToast();

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");

  const sendForm = async (formData: FormData) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.get("email") }),
    });
    toast({
      title: "Email inviata",
      description:
        "Verifica la tua casella di posta elettronica per ricevere le istruzioni per reimpostare la tua password.",
      status: "info",
      duration: 30000,
      isClosable: false,
    });
  };

  return (
    <DefaultAuth>
      <Box
        w="100%"
        mx="auto"
        my={{ base: "30px", md: "60px" }}
        maxW="420px"
        p="30px"
        bgColor="white"
        borderRadius="12px"
        boxShadow="lg"
      >
        <Heading color={textColor} fontSize="36px" mb="10px">
          Recupero password
        </Heading>
        <Text
          mb="36px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          Inserisci la tua email per ricevere un link di recupero.
        </Text>

        <form action={sendForm}>
          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email
            </FormLabel>
            <Input
              isRequired={true}
              fontSize="sm"
              type="email"
              placeholder="Inserisci la tua email"
              mb="24px"
              size="lg"
              name="email"
              data-testid="mt-email-field"
            />
            <SubmitButton
              w="100%"
              loadingText="Invio in corso..."
              data-testid="mt-send-button"
            >
              Invia link di recupero password
            </SubmitButton>
          </FormControl>
        </form>

        <Text
          mt="20px"
          fontSize="sm"
          textAlign="center"
          color={textColorSecondary}
        >
          Hai già un account?{" "}
          <Link href="/login" fontWeight="bold" color={textColorBrand}>
            Accedi
          </Link>
        </Text>
      </Box>
    </DefaultAuth>
  );
}
