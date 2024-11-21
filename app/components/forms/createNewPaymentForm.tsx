"use client";

import { useEffect, useState } from "react";
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
import PriceField from "@/app/components/fields/PriceField";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import { useFormState } from "react-dom";
import createNewPaymentAction from "@/app/actions/createNewPayment.action";

export default function PaymentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formState, action] = useFormState(createNewPaymentAction, {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    await action(formData);
  };

  useEffect(() => {
    console.log(formState);
    if (formState?.paymentLink) {
      setIsSubmitted(true);
      setPaymentLink(formState.paymentLink);
    }
  }, [formState]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" p={10}>
        <ModalHeader p={0} mb="20px">
          <Box as="span" textAlign="left">
            <b>Crea nuovo link di pagamento istantaneo</b>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {!isSubmitted ? (
            <form action={handleSubmit} style={{ width: "100%" }}>
              <Flex flexDirection="column" alignItems="center">
                <PriceField
                  id="amount"
                  label="Prezzo"
                  name="amount"
                  type="text"
                  placeholder="Prezzo"
                  isRequired={true}
                  errors={getFormErrors(formState.errors, "price")}
                />
                <SubmitButton>Genera metodi di pagamento</SubmitButton>
              </Flex>
            </form>
          ) : (
            <Flex flexDirection="column" alignItems="center" gap={6}>
              <Text fontSize="lg">Grazie! Ecco il link per il pagamento:</Text>
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
