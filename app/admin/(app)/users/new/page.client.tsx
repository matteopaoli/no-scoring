"use client";

import { Button, Text, useColorModeValue, Box, FormControl, FormHelperText, SimpleGrid } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import createUserAction from "./createUser.action";
import { useFormState } from "react-dom";
import InputField from "@/app/components/fields/InputField"; // Import the InputField component
import TextArea from "@/app/components/fields/TextArea"; // Import the TextArea component
import getFormErrors from "@/app/utils/getFormErrors"; // Utility for fetching errors
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import FormLabel from "@/app/components/fields/FormLabel";

type CreateUserPageProps = {
  businessTypesOptions: ReactNode[];
  partners: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
  }[]
};

export default function CreateUserPage({
  businessTypesOptions,
  partners
}: CreateUserPageProps) {
  const [errors, action] = useFormState(createUserAction, []);
  const [partnerId, setPartnerId] = useState(null)

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const handlePartnerChange = (p) => {
    setPartnerId(p)
  }

  const myCustomFilter = (query: string, _: string, optionLabel: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseOptionLabel = optionLabel.toLowerCase();
    
    return lowerCaseOptionLabel.indexOf(lowerCaseQuery) !== -1 
  }

  const handleSubmit = (formData: FormData) => {
    if (partnerId) {
      formData.append('partner', partnerId)
    }
    action(formData)
  }

  return (
    <Box width="100%">
      <form action={handleSubmit} style={{ width: "100%" }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} columnGap="50px">
          <InputField
            id="user-email"
            label="Email"
            name="email"
            placeholder="mail@email.com"
            isRequired={true}
            errors={getFormErrors(errors, "email")}
          />

          <InputField
            id="business-name"
            label="Nome azienda"
            name="businessName"
            placeholder="Pinco Pallino s.r.l."
            isRequired={true}
            errors={getFormErrors(errors, "businessName")}
          />

          <Select
            id="business-type"
            label="Tipo Business"
            name="businessTypeId"
            placeholder="Seleziona uno"
            isRequired={true}
            errors={getFormErrors(errors, "businessTypeId")}
          >
            {businessTypesOptions}
          </Select>

          <FormControl mb="30px">
            <FormLabel id="partner">Partner</FormLabel>
            <AutoComplete openOnFocus filter={myCustomFilter} onChange={handlePartnerChange}>
              <AutoCompleteInput variant="main" placeholder="Ricerca Partner..." _placeholder={{ fontWeight: "400", color: "secondaryGray.600" }} />
              <AutoCompleteList>
                {partners.map((partner, i) => (
                  <AutoCompleteItem
                    key={`option-${i}`}
                    value={partner}
                    textTransform="capitalize"
                    label={`${partner.firstName} ${partner.lastName}`}
                  >
                    {`${partner.firstName} ${partner.lastName}`}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
            {/* <input type="hidden" value={partnerId} name="partner" /> */}
          </FormControl>

          <TextArea
            id="stripe-api-key"
            label="Stripe API Token"
            name="stripeApiKey"
            placeholder="Stripe API Token"
            isRequired={true}
            errors={getFormErrors(errors, "stripeApiKey")}
          />

          <TextArea
            id="stripe-user-id"
            label="ID Stripe Utente"
            name="stripeUserId"
            placeholder="ID Stripe Utente"
            isRequired={true}
            errors={getFormErrors(errors, "stripeUserId")}
          />

          <TextArea
            id="stripe-leg-account-id"
            label="ID Stripe LEG"
            name="stripeLegAccountId"
            placeholder="ID Stripe LEG"
            isRequired={true}
            errors={getFormErrors(errors, "stripeLegAccountId")}
          />

        </SimpleGrid>
        <SubmitButton>Aggiungi Utente</SubmitButton>
      </form>
    </Box>
  );
}
