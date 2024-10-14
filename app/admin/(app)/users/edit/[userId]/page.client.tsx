"use client";

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { useFormState } from "react-dom";
import updateUserAction from "./updateUser.action";
import InputField from "@/app/components/fields/InputField";
import TextArea from "@/app/components/fields/TextArea";
import getFormErrors from "@/app/utils/getFormErrors";
import Select from "@/app/components/fields/Select";
import { SubmitButton } from "@/app/submit-button";
import { User } from "@/app/db";

type UpdateUserPageProps = {
  businessTypesOptions: ReactNode[];
  existingUser: User;
};

export default function UpdateUserPage({
  businessTypesOptions,
  existingUser,
}: UpdateUserPageProps) {
  const [errors, action] = useFormState(updateUserAction, []);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <Box width="100%">
      <form action={action} style={{ width: "100%" }}>
        <InputField
          id="user-email"
          label="Email"
          name="email"
          placeholder="mail@email.com"
          isRequired={true}
          value={existingUser.email}
          readOnly={true} // Email cannot be changed
          errors={getFormErrors(errors, "email")}
        />

        <InputField
          id="business-name"
          label="Nome azienda"
          name="businessName"
          placeholder="Pinco Pallino s.r.l."
          isRequired={true}
          defaultValue={existingUser.businessName}
          errors={getFormErrors(errors, "businessName")}
        />

        <Select
          id="business-type"
          label="Tipo Business"
          name="businessTypeId"
          placeholder="Seleziona uno"
          isRequired={true}
          defaultValue={existingUser.businessTypeId}
          errors={getFormErrors(errors, "businessTypeId")}
        >
          {businessTypesOptions}
        </Select>

        <TextArea
          id="stripe-api-key"
          label="Stripe API Token"
          name="stripeApiKey"
          placeholder="Stripe API Token"
          isRequired={true}
          defaultValue={existingUser.stripeSecretKey}
          errors={getFormErrors(errors, "stripeApiKey")}
        />

        <TextArea
          id="stripe-user-id"
          label="ID Stripe Utente"
          name="stripeUserId"
          placeholder="ID Stripe Utente"
          isRequired={true}
          defaultValue={existingUser.stripeUserId}
          errors={getFormErrors(errors, "stripeUserId")}
        />

        <TextArea
          id="stripe-leg-account-id"
          label="ID Stripe LEG"
          name="stripeLegAccountId"
          placeholder="ID Stripe LEG"
          isRequired={true}
          defaultValue={existingUser.stripeLegAccountId}
          errors={getFormErrors(errors, "stripeLegAccountId")}
        />

        <SubmitButton>Aggiorna utente</SubmitButton>
      </form>
    </Box>
  );
}
