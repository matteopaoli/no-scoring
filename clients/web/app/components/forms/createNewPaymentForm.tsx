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
  Checkbox,
  Button,
} from "@chakra-ui/react";
import PriceField from "@/app/components/fields/PriceField";
import getFormErrors from "@/app/utils/getFormErrors";
import SubmitButton from "@/app/components/SubmitButton";
import { useFormState } from "react-dom";
import createNewPaymentAction from "@/app/actions/createNewPayment.action";
import CopyTextBox from "../copyTextBox/CopyTextBox";
import { getAmountWithFees } from "@/app/utils/fees";

export default function PaymentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formState, action] = useFormState(createNewPaymentAction, {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [amount, setAmount] = useState(0);
  const [includeFees, setIncludeFees] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await action(formData);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value.replace(",", ".")) || 0;
    setAmount(price);
  }

  useEffect(() => {
    if (formState?.paymentLink) {
      setIsSubmitted(true);
    }
  }, [formState]);

  const reset = () => {
    setIsSubmitted(false);
  }

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
                  onChange={handleAmountChange}
                />
                <Box mb={4}>
                  <Checkbox
                    isChecked={includeFees}
                    onChange={() => setIncludeFees(!includeFees)}
                    name="includeFees"
                  >
                    <Text as="span">Commissioni a carico del cliente</Text>
                  </Checkbox>
                  {includeFees && (
                    <Text mt={2}>
                      Prezzo finale: <b>€{getAmountWithFees(amount).toFixed(2)}</b>
                    </Text>
                  )}
                </Box>
                <SubmitButton>Genera metodi di pagamento</SubmitButton>
              </Flex>
            </form>
          ) : (
            <Flex flexDirection="column" alignItems="center" gap={6}>
              <Text fontSize="lg">Ecco il link per il pagamento:</Text>
              {formState.paymentLink && (
                <CopyTextBox>{formState.paymentLink}</CopyTextBox>
              )}
              <Image
                src={formState.qrcode}
                alt="QR Code"
                boxSize="150px"
              />
              <Button variant="solid" colorScheme="brand" onClick={reset}>Crea un nuovo link di pagamento</Button>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
