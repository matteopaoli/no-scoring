"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import PriceField from "@/app/components/fields/PriceField";
import getFormErrors from "../../utils/getFormErrors";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import createNewPaymentAction from "../../actions/createNewPayment.action";
import { getAmountWithFees } from "../../utils/fees";
import SubmitButton from "../../components/SubmitButton";
import CopyTextBox from "../../components/copyTextBox/CopyTextBox";
import Image from "next/image";

export default function NewPaymentForm() {
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
  };

  useEffect(() => {
    if (formState?.paymentLink) {
      setIsSubmitted(true);
    }
  }, [formState]);

  const reset = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Flex flexDirection="column" alignItems="center" gap={6}>
        <Text fontSize="lg">Ecco il link per il pagamento:</Text>
        {formState.paymentLink && (
          <CopyTextBox>{formState.paymentLink}</CopyTextBox>
        )}
        <Image
          src={formState.qrcode}
          alt="QR Code"
          boxSize="150px"
          width={150}
          height={150}
        />
        <Button variant="solid" colorScheme="brand" onClick={reset}>
          Crea un nuovo link di pagamento
        </Button>
      </Flex>
    );
  }
  
  return (
    <form action={handleSubmit} style={{ width: "100%" }}>
      <Flex flexDirection="column">
        <PriceField
          id="amount"
          label="Prezzo"
          name="amount"
          type="text"
          placeholder="Prezzo"
          isRequired={true}
          errors={getFormErrors(formState.errors, "price")}
          onChange={handleAmountChange}
          maxW="400px"
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
        <SubmitButton>Crea link di pagamento</SubmitButton>
      </Flex>
    </form>
  );
}
