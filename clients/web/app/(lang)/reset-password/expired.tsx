"use client";
import React from "react";
// Chakra imports
import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import DefaultAuth from "@/app/layouts/admin/Auth";
import { Link } from "@chakra-ui/next-js";

export default function ForgotPasswordExpired() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");
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
          Richiesta scaduta
        </Heading>
        <Text
          mb="36px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          La tua richiesta di recupero della password è stata annullata perché è
          scaduta.<br /> Per favore, richiedi nuovamente il recupero della password.
        </Text>

        <Text
          mt="20px"
          fontSize="sm"
          textAlign="center"
          color={textColorSecondary}
        >
          Vuoi fare l&apos;accesso?{" "}
          <Link href="/login" fontWeight="bold" color={textColorBrand}>
            Accedi
          </Link>
        </Text>
      </Box>
    </DefaultAuth>
  );
}
