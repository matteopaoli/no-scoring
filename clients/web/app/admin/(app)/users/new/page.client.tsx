"use client";

import { Box, FormControl, SimpleGrid, Flex } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import createUserAction from "./createUser.action";
import { useFormState } from "react-dom";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import FormLabel from "@/app/components/fields/FormLabel";
import PhoneNumberField from "@/app/components/fields/PhoneNumberField";
import { provinces } from "@/app/constants";

type CreateUserPageProps = {
  businessTypesOptions: ReactNode[];
  partners: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
  }[];
};

export default function CreateUserPage({
  businessTypesOptions,
  partners,
}: CreateUserPageProps) {
  const [errors, action] = useFormState(createUserAction, []);
  const [partnerId, setPartnerId] = useState(null);

  const handlePartnerChange = (p) => {
    setPartnerId(p);
  };

  const myCustomFilter = (query: string, _: string, optionLabel: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseOptionLabel = optionLabel.toLowerCase();

    return lowerCaseOptionLabel.indexOf(lowerCaseQuery) !== -1;
  };

  const handleSubmit = (formData: FormData) => {
    if (partnerId) {
      formData.append("partner", partnerId);
    }
    action(formData);
  };

  return (
    <Box width="100%" background="white" p={10} borderRadius="lg">
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

          <PhoneNumberField
            id="phoneNumber"
            label="Telefono"
            name="phoneNumber"
            placeholder="+39 123 456 7890"
            errors={getFormErrors(errors, "phoneNumber")}
            isRequired
          />

          <InputField
            id="refName"
            label="Nome Referente"
            name="refName"
            placeholder="Nome Referente"
            errors={getFormErrors(errors, "refName")}
          />

          <InputField
            id="business-name"
            label="Nome azienda"
            name="businessName"
            placeholder="Nome azienda"
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
            <AutoComplete
              openOnFocus
              filter={myCustomFilter}
              onChange={handlePartnerChange}
            >
              <AutoCompleteInput
                variant="main"
                placeholder="Ricerca Partner..."
                _placeholder={{ fontWeight: "400", color: "secondaryGray.600" }}
              />
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
          </FormControl>

          <Select
            id="user-provincia"
            label="Provincia"
            name="provincia"
            placeholder="Seleziona una provincia"
            errors={getFormErrors(errors, "provincia")}
            isRequired
          >
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </Select>
        </SimpleGrid>
        <Flex
          justifyContent={{
            base: "center",
            md: "flex-end",
          }}
          width="100%"
        >
          <SubmitButton>Aggiungi Utente</SubmitButton>
        </Flex>
      </form>
    </Box>
  );
}
