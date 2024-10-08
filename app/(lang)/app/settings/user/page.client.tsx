"use client";

import { Box, Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import InputField from "@/app/components/fields/InputField";
import { useFormState } from "react-dom";
import updateUserAction from "./updateUser.action";
import getFormErrors from "@/app/utils/getFormErrors";

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

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");

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
          errors={getFormErrors(errors, 'firstName')}
        />

        {/* Last Name */}
        <InputField
          id="lastName"
          name="lastName"
          label="Cognome"
          placeholder="Inserisci il cognome"
          type="text"
          defaultValue={user.lastName}
          errors={getFormErrors(errors, 'lastName')}
        />

        {/* Password */}
        <InputField
          id="password"
          label="Password"
          placeholder="Inserisci la nuova password"
          type="password"
          name="password"
          errors={getFormErrors(errors, 'password')}
        />

        {/* Repeat Password */}
        <InputField
          id="repeatPassword"
          name="repeatPassword"
          label="Ripeti Password"
          placeholder="Ripeti la password"
          type="password"
          errors={getFormErrors(errors, 'repeatPassword')}
        />
        
        {/* Submit Button */}
        <Button
          type="submit"
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="24px"
        >
          Aggiorna Profilo
        </Button>
      </form>
    </Box>
  );
}