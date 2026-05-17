"use client";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import createPartnerAction from "./createPartner.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import { ReactNode, useActionState } from "react";

export default function CreatePartnerPage({ regionsOptions }: { regionsOptions: ReactNode[]; }) {
  const [errors, action] = useActionState(createPartnerAction, []);

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
            id="user-nome"
            label="Nome"
            name="firstName"
            placeholder="Inserisci il nome"
            isRequired={true}
            errors={getFormErrors(errors, "nome")}
          />

          <InputField
            id="user-cognome"
            label="Cognome"
            name="lastName"
            placeholder="Inserisci il cognome"
            isRequired={true}
            errors={getFormErrors(errors, "cognome")}
          />

          <InputField
            id="user-email"
            label="Email"
            name="email"
            placeholder="mail@email.com"
            isRequired={true}
            errors={getFormErrors(errors, "email")}
          />

          <Select
            id="user-provincia"
            label="Provincia"
            name="regionId"
            placeholder="Seleziona una provincia"
            errors={getFormErrors(errors, "regionId")}
          >
            {regionsOptions}
          </Select>

          <SubmitButton>Aggiungi Partner</SubmitButton>
        </form>
      </Box>
    </Flex>
  );
}
