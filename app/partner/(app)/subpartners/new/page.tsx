"use client";
import { useActionState } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import createSubPartnerAction from "./createSubPartner.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import Select from "@/app/components/fields/Select";
import SubmitButton from "@/app/components/SubmitButton";
import { provinces } from "@/app/constants";

export default function CreateSubPartnerPage() {
  const [errors, action] = useActionState(createSubPartnerAction, []);

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
            name="provincia"
            placeholder="Seleziona una provincia"
            errors={getFormErrors(errors, "provincia")}
          >
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </Select>

          <SubmitButton>Aggiungi Agente</SubmitButton>
        </form>
      </Box>
    </Flex>
  );
}
