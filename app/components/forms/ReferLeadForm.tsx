"use client";

import { useFormState } from "react-dom";
import updateUserSettingsAction from "@/app/actions/updateUserSettings.action";
import {
  Box,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import referLeadAction from "./referLead.action";
import { usePathname, useRouter } from "next/navigation";

export default function ReferLeadForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [errors, action] = useFormState(referLeadAction, []);
  const router = useRouter()
  const pathname = usePathname()

  const onSubmit = async (formData: FormData) => {
    await action(formData)
    if (errors.length === 0) {
      onClose()
      router.replace(`${pathname}?success=true`)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>
          <Box as="span" textAlign="left">
            <b>Segnala un nuovo contatto</b>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <form action={onSubmit} style={{ width: "100%" }}>
          <ModalBody pb={4}>
            <Text mb={8}>
              Inserisci qui tutte le informazioni necessarie sul tuo contatto..
              Una volta inviato, il contatto riceverà una notifica via email e
              il team di PayTomorrow procederà con la revisione e il supporto
              necessari.
            </Text>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap={6}
            >
              <InputField
                id="firstName"
                name="firstName"
                label="Nome"
                placeholder="Inserisci il nome"
                type="text"
                errors={getFormErrors(errors, "firstName")}
              />
              <InputField
                id="lastName"
                name="lastName"
                label="Cognome"
                placeholder="Inserisci il cognome"
                type="text"
                errors={getFormErrors(errors, "lastName")}
              />
              <InputField
                id="businessName"
                name="businessName"
                label="Nome Attività"
                placeholder="Inserisci il nome dell'attività"
                type="text"
                errors={getFormErrors(errors, "businessName")}
              />
              <InputField
                id="sector"
                name="sector"
                label="Settore"
                placeholder="Inserisci il settore"
                type="text"
                errors={getFormErrors(errors, "sector")}
              />
              <InputField
                id="email"
                name="email"
                label="Indirizzo Email"
                placeholder="Inserisci l'indirizzo email"
                type="email"
                errors={getFormErrors(errors, "email")}
              />
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                label="Numero di Telefono"
                placeholder="Inserisci il numero di telefono"
                type="tel"
                errors={getFormErrors(errors, "phoneNumber")}
              />
            </Grid>
          </ModalBody>

          <ModalFooter>
            <SubmitButton>Invia contatto</SubmitButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
