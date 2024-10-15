"use client";

import {
  Box,
  Button,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useFormState } from "react-dom";
import InputField from "@/app/components/fields/InputField";
import updateUserAction from "./updateUser.action";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface EditUserPageProps {
  user: User;
}

export default function EditUserPage({ user }: EditUserPageProps) {
  const [errors, action] = useFormState(updateUserAction, []);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");

  const handleRemoveAccount = async () => {
    try {
      const response = await fetch(`/api/remove-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }), // Send user's email to identify the account
      });

      if (!response.ok) {
        throw new Error("Failed to remove account");
      }

      // Handle successful account removal (e.g., redirect to homepage or show a success message)
      alert("Account removed successfully");
      // Optionally, redirect the user or perform any other actions here
    } catch (error) {
      console.error(error);
      alert("Error removing account");
    } finally {
      onClose(); // Close modal after operation
    }
  };

  return (
    <Box width={{ base: "100%", md: "500px" }}>
      <form action={action} style={{ width: "100%" }}>
        {/* Email (non-editable) */}
        <InputField
          id="email"
          label="Indirizzo Email"
          placeholder=""
          type="text"
          isDisabled={true}
          value={user.email}
          errors={[]}
        />

        {/* First Name */}
        <InputField
          id="firstName"
          name="firstName"
          label="Nome"
          placeholder="Inserisci il nome"
          type="text"
          defaultValue={user.firstName}
          errors={getFormErrors(errors, "firstName")}
        />

        {/* Last Name */}
        <InputField
          id="lastName"
          name="lastName"
          label="Cognome"
          placeholder="Inserisci il cognome"
          type="text"
          defaultValue={user.lastName}
          errors={getFormErrors(errors, "lastName")}
        />

        {/* Password */}
        <InputField
          id="password"
          label="Password"
          placeholder="Inserisci la nuova password"
          type="password"
          name="password"
          errors={getFormErrors(errors, "password")}
        />

        {/* Repeat Password */}
        <InputField
          id="repeatPassword"
          name="repeatPassword"
          label="Ripeti Password"
          placeholder="Ripeti la password"
          type="password"
          errors={getFormErrors(errors, "repeatPassword")}
        />

        {/* Submit Button */}
        <VStack w="100%">
          <SubmitButton>Aggiorna Profilo</SubmitButton>
          <Button
            fontSize="sm"
            variant="solid"
            colorScheme="red"
            fontWeight="500"
            w={{ base: "100%", md: "300px" }}
            h="50"
            mt="24px"
            onClick={onOpen}
          >
            Rimuovi Account
          </Button>
        </VStack>
      </form>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}
