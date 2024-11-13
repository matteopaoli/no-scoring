"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
} from "@chakra-ui/react";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import partnerCreateMerchantAction from "./partnerCreateMerchant.action";
import { useFormState } from "react-dom";

export default function PaymentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [errors, action] = useFormState(partnerCreateMerchantAction, []);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const response = await action(formData);
    // Assuming `response` contains a payment link
    setPaymentLink(response.paymentLink);
    setIsSubmitted(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" p={10}>
        <ModalHeader p={0} mb="20px">
          <Box as="span" textAlign="left">
            <b>Pagamento</b>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isSubmitted ? (
            <form action={handleSubmit} style={{ width: "100%" }}>
              <Flex flexDirection="column" alignItems="center" gap={4}>
                <InputField
                  id="price"
                  label="Prezzo"
                  name="price"
                  placeholder="Inserisci l'importo"
                  isRequired={true}
                  type="number"
                  errors={getFormErrors(errors, "price")}
                  size="lg"
                  inputProps={{ fontSize: "2xl", textAlign: "center" }}
                />
                <SubmitButton>Procedi al Pagamento</SubmitButton>
              </Flex>
            </form>
          ) : (
            <Flex flexDirection="column" alignItems="center" gap={6}>
              <Text fontSize="lg">
                Grazie! Ecco il link per il pagamento:
              </Text>
              {paymentLink && (
                <Text
                  as="a"
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.500"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Vai al pagamento
                </Text>
              )}
              {/* Example images */}
              <Image
                src="/images/payment-success.png"
                alt="Success"
                boxSize="150px"
              />
              <Image
                src="/images/payment-secure.png"
                alt="Secure Payment"
                boxSize="150px"
              />
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
