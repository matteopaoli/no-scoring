import type React from "react";
import { Box, Button, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { updateProfileAction } from "../updateProfile.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import ProfileImageInput from "@/app/components/fields/ProfileImageInput";
import { useEffect, useState } from "react";
import SubmitButton from "@/app/components/SubmitButton";
import { FormActionReturnTypeWithStatus } from "@/app/types";

interface StepProfileProps {
  onNext: () => void;
  session: any; // Adjust type as needed for session
}

const StepProfile: React.FC<StepProfileProps> = ({ onNext }) => {
  const [profileFormState, action] = useFormState(updateProfileAction, {});

  useEffect(() => {
    if (profileFormState.status === "success") {
      onNext();
    }
  }, [profileFormState]);

  return (
    <form action={action} style={{ width: "100%" }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} w="100%">
        <GridItem>
          <InputField
            id="firstName"
            label="Nome"
            name="firstName"
            placeholder="Inserisci il tuo nome"
            isRequired
            errors={getFormErrors(profileFormState.errors, "firstName")}
            data-testid="mt-setup-profile-firstname"
          />
          <InputField
            id="lastName"
            label="Cognome"
            name="lastName"
            placeholder="Inserisci il tuo cognome"
            isRequired
            errors={getFormErrors(profileFormState.errors, "lastName")}
            data-testid="mt-setup-profile-lastname"
          />
        </GridItem>
        <GridItem mx="auto">
          <ProfileImageInput id="image" name="image" label="Immagine Profilo" />
        </GridItem>
      </SimpleGrid>
      <Box textAlign="center">
        <SubmitButton>Salva e Continua</SubmitButton>
      </Box>
    </form>
  );
};

export default StepProfile;
