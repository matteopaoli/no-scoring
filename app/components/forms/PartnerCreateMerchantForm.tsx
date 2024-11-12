"use client";

import { useFormState } from "react-dom";
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
import { ReactNode } from "react";

export default function ReferLeadForm({
  isOpen,
  onClose,
  businessTypesOptions,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessTypesOptions: ReactNode[];
}) {
  const [errors, action] = useFormState(partnerCreateMerchantAction, []);

  const handleSubmit = async (formData: FormData) => {
    await action(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" p={10}>
        <ModalHeader p={0} mb="20px">
          <Box as="span" textAlign="left">
            <b>Crea un nuovo profilo commerciante</b>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <form action={handleSubmit} style={{ width: "100%" }}>
          <SimpleGrid columns={{ base: 1 }} columnGap="50px">
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
          </SimpleGrid>
          <Flex justifyContent="end" w="100%">
            <SubmitButton>Aggiungi Utente</SubmitButton>
          </Flex>
        </form>
      </ModalContent>
    </Modal>
  );
}
