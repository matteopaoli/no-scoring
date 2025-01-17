"use client";
import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "@/app/layouts/admin/Auth";
// Assets
import login from "./posLogin.action";
import { useDictionary } from "@/app/DictionaryProvider";
import { useFormState } from "react-dom";
import Callout from "@/app/components/Callout";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: Record<string, any> = {};

export default function SignIn() {
  const t = useDictionary();
  const [formState, action] = useFormState(login, initialState);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <DefaultAuth>
      <Callout autoDismiss={true} dismissDuration={5000} />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        direction={{ base: "column-reverse", md: "row" }}
        gap={{ base: 5, md: 20 }}
        px="20px"
      >
        <Flex
          maxW={{ base: "100%", md: "max-content" }}
          w="100%"
          mx={{ base: "50px", lg: "0px" }}
          alignItems="start"
          justifyContent="center"
          mb={{ base: "30px", md: "60px" }}
          px={{ base: "25px", md: "0" }}
          p={{ md: "50px" }}
          borderRadius={12}
          mt={{ base: "40px", md: "14vh" }}
          flexDirection="column"
          bgColor="white"
        >
          {formState?.success && (
            <Alert status="success" mb="20px">
              <AlertIcon />
              Per favore controlla la posta per ricevere il link di accesso.
            </Alert>
          )}
          <Box me="auto">
            <Heading color={textColor} fontSize="36px" mb="10px">
              {t("signIn")} (POS)
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="md"
            >
              Inserisci la tua email per effettuare l&apos;accesso
            </Text>
          </Box>
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: "100%", md: "420px" }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: "auto", lg: "unset" }}
            me="auto"
            mb={{ base: "20px", md: "auto" }}
          >
            <form action={action}>
              <FormControl isInvalid={formState?.error}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  {t("email")}
                  <Text color={brandStars}>{t("requiredField")}</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  fontSize="sm"
                  ms={{ base: "0px", md: "0px" }}
                  type="email"
                  placeholder="Inserisci email"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  name="email"
                  data-testid="mt-email-field"
                />
                <SubmitButton
                  w="100%"
                  loadingText="Accesso in corso"
                  data-testid="mt-login-button"
                >
                  {t("signIn")}
                </SubmitButton>
              </FormControl>
            </form>
          </Flex>
        </Flex>
        {/* <Box bg="white" p={5} borderRadius="lg" boxShadow="sm" maxW="700px">
          Ciao
        </Box> */}
      </Flex>
    </DefaultAuth>
  );
}
