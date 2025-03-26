"use client";
import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "@/app/layouts/admin/Auth";
import { Link } from "@chakra-ui/next-js";
import SubmitButton from "@/app/components/SubmitButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordClientPage() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(newPassword);
    console.log(confirmPassword);
    if (newPassword !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: resetToken, newPassword }),
        }
      );

      if (response.ok) {
        // Success: Password reset
        toast({
          title: "Password reimpostata",
          description: "La tua password è stata aggiornata con successo.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/login"); // Redirect to login after successful password reset
      } else if (response.status === 400) {
        // Handle validation errors
        const data = await response.json();

        // Check if there are validation messages
        if (data.message && Array.isArray(data.message)) {
          // Emit one toast for each validation error
          data.message.forEach((errorMessage: string) => {
            toast({
              title: "Errore di validazione",
              description: errorMessage,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
        } else {
          // Default error message if the format is unexpected
          toast({
            title: "Errore di validazione",
            description: "Si è verificato un errore di validazione, riprova.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Handle generic errors (not 400)
        toast({
          title: "Errore",
          description: "Si è verificato un errore, riprova più tardi.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      // Handle unexpected errors (network or other issues)
      toast({
        title: "Errore",
        description: "Si è verificato un errore, riprova più tardi.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
          Reimposta la tua password
        </Heading>
        <Text
          mb="36px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          Inserisci una nuova password.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={error !== null}>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Nuova Password
            </FormLabel>
            <Input
              isRequired={true}
              fontSize="sm"
              type="password"
              placeholder="Nuova password"
              mb="24px"
              size="lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              data-testid="mt-new-password-field"
            />
          </FormControl>

          <FormControl isInvalid={error !== null}>
            <FormLabel
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Conferma Password
            </FormLabel>
            <Input
              isRequired={true}
              fontSize="sm"
              type="password"
              placeholder="Conferma la tua password"
              mb="24px"
              size="lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="mt-confirm-password-field"
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <SubmitButton
            w="100%"
            loadingText="Reimpostazione in corso..."
            isLoading={isLoading}
            data-testid="mt-submit-button"
          >
            Reimposta Password
          </SubmitButton>
        </form>

        <Text
          mt="20px"
          fontSize="sm"
          textAlign="center"
          color={textColorSecondary}
        >
          Ricordi la tua password?{" "}
          <Link href="/login" fontWeight="bold" color={textColorBrand}>
            Accedi
          </Link>
        </Text>
      </Box>
    </DefaultAuth>
  );
}
