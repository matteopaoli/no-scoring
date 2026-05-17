"use client";

import {
  Box,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Select from "@/app/components/fields/Select";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import partnerCreateMerchantAction from "./partnerCreateMerchant.action";
import { ReactNode, useEffect, useActionState } from "react";
import PhoneNumberField from "../fields/PhoneNumberField";
import { useRouter } from "next/navigation";

export default function ReferLeadForm({
  isOpen,
  onClose,
  businessTypesOptions,
  regionsOptions
}: {
  isOpen: boolean;
  onClose: () => void;
  businessTypesOptions: ReactNode[];
  regionsOptions: ReactNode[];
}) {
  const [formState, action] = useActionState(partnerCreateMerchantAction, {});
  const router = useRouter();

  useEffect(() => {
    if (formState.status === "success") {
      onClose();
      router.push("/partner/merchants?success=true&action=createMerchant");
    }
  }, [formState]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" p={10}>
        <ModalHeader p={0} mb="20px">
          <Box as="span" textAlign="left">
            <b>Crea un nuovo profilo lead</b>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <form action={action} style={{ width: "100%" }}>
          <SimpleGrid columns={{ base: 1 }} columnGap="50px">
            <InputField
              id="user-email"
              label="Email"
              name="email"
              placeholder="mail@email.com"
              isRequired={true}
              errors={getFormErrors(formState.errors, "email")}
            />

            <InputField
              id="ref-name"
              label="Nome referente"
              name="refName"
              placeholder="Nome referente"
              isRequired={true}
              errors={getFormErrors(formState.errors, "refName")}
            />

            <PhoneNumberField
              id="phone-number"
              label="Telefono"
              name="phoneNumber"
              placeholder="+39 123 456 7890"
              isRequired={true}
              errors={getFormErrors(formState.errors, "phoneNumber")}
            />

            <InputField
              id="business-name"
              label="Nome azienda"
              name="businessName"
              placeholder="Pinco Pallino s.r.l."
              isRequired={true}
              errors={getFormErrors(formState.errors, "businessName")}
            />
            <Select
              id="business-type"
              label="Tipo Business"
              name="businessTypeId"
              placeholder="Seleziona uno"
              isRequired={true}
              errors={getFormErrors(formState.errors, "businessTypeId")}
            >
              {businessTypesOptions}
            </Select>

            <Select
              id="user-provincia"
              label="Provincia"
              name="regionId"
              placeholder="Seleziona una provincia"
              errors={getFormErrors(formState.errors, "regionId")}
              isRequired
            >
              {regionsOptions}
            </Select>
          </SimpleGrid>
          <Flex justifyContent="end" w="100%">
            <SubmitButton>Aggiungi Utente</SubmitButton>
          </Flex>
        </form>
      </ModalContent>
    </Modal>
  );
}
