"use client";

import {
  Button,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import createUserAction from "./createUser.action";
import { useFormState } from "react-dom";
import InputField from "@/app/components/fields/InputField"; // Import the InputField component
import TextArea from "@/app/components/fields/TextArea"; // Import the TextArea component
import getFormErrors from "@/app/utils/getFormErrors"; // Utility for fetching errors
import Select from "@/app/components/fields/Select";

type CreateUserPageProps = {
  businessTypesOptions: ReactNode[];
};

export default function CreateUserPage({
  businessTypesOptions,
}: CreateUserPageProps) {
  const [errors, action] = useFormState(createUserAction, []);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <Box width="100%">
      <form action={action} style={{ width: '100%' }}>
        <InputField
          id="user-email"
          label="Email"
          name="email"
          placeholder="mail@email.com"
          isRequired={true}
          errors={getFormErrors(errors, 'email')}
        />
        
        <InputField
          id="business-name"
          label="Nome azienda"
          name="businessName"
          placeholder="Pinco Pallino s.r.l."
          isRequired={true}
          errors={getFormErrors(errors, 'businessName')}
        />

        <Select
          id="business-type"
          label="Tipo Business"
          name="businessTypeId"
          placeholder="Seleziona uno"
          isRequired={true}
          errors={getFormErrors(errors, 'businessTypeId')}
        >
        {businessTypesOptions}
        </Select>
        <TextArea
          id="stripe-api-key"
          label="Stripe API Token"
          name="stripeApiKey"
          placeholder="Stripe API Token"
          isRequired={true}
          errors={getFormErrors(errors, 'stripeApiKey')}
        />

        <TextArea
          id="stripe-user-id"
          label="ID Stripe Utente"
          name="stripeUserId"
          placeholder="ID Stripe Utente"
          isRequired={true}
          errors={getFormErrors(errors, 'stripeUserId')}
        />

        <Button
          type="submit"
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="24px"
        >
          Aggiungi utente
        </Button>
      </form>
    </Box>
  );
}
