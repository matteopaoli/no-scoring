"use client";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, useActionState } from "react";
import updateUserAction from "./updatePartner.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import { User } from "@/app/db";

type UpdateUserPageProps = {
  existingPartner: User;
  regionsOptions: ReactNode[];
};

export default function UpdateUserPage({
  existingPartner,
  regionsOptions,
}: UpdateUserPageProps) {
  const [errors, action] = useActionState(updateUserAction, []);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <Flex
      maxW={{ base: "100%" }}
      w={{ base: "100%", md: "500px" }}
      h="100%"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      flexDirection="column"
    >
      <Box width="100%">
        <form action={action} style={{ width: "100%" }}>
          <InputField
            id="email"
            label="Email"
            name="email"
            placeholder="mail@email.com"
            isRequired={true}
            defaultValue={existingPartner.email}
            readOnly={true} // Email cannot be changed
            errors={getFormErrors(errors, "email")}
          />
          <InputField
            id="firstName"
            label="Nome"
            name="firstName"
            placeholder="Inserisci il nome"
            isRequired={true}
            defaultValue={existingPartner.firstName}
            errors={getFormErrors(errors, "firstName")}
          />

          <InputField
            id="lastName"
            label="Cognome"
            name="lastName"
            placeholder="Inserisci il cognome"
            isRequired={true}
            defaultValue={existingPartner.lastName}
            errors={getFormErrors(errors, "lastName")}
          />
          <Select
            id="provincia"
            label="Provincia"
            defaultValue={existingPartner.regionId}
            name="provincia"
            placeholder="Seleziona una provincia"
            errors={getFormErrors(errors, "provincia")}
          >
            {regionsOptions}
          </Select>
          <SubmitButton>Aggiorna Partner</SubmitButton>
        </form>
      </Box>
    </Flex>
  );
}
