"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import SubmitButton from "@/app/components/SubmitButton";
import { acceptTosAction } from "@/app/api/acceptTos/acceptTos.action";
import { useFormState } from "react-dom";

interface StepTOSProps {
  onAccept: () => void;
}

const StepTOS: React.FC<StepTOSProps> = ({ onAccept }) => {
  const [formState, action] = useFormState(acceptTosAction, {});

  useEffect(() => {
    if (formState.status === "success") {
      onAccept();
    }
  }, [formState])

  return (
    <form action={action}>
      <Box width="full">
        <Text fontSize="lg" mb={4}>
          Leggi attentamente i{" "}
          <Link
            color="brand.600"
            textDecoration="underline"
            href="https://paytomorrow.it/doc"
            target="_blank"
            rel="nofollow"
          >
            termini e le condizioni di utilizzo
          </Link>
          . Accettando le Condizioni di Servizio, dichiari di aver compreso e
          accettato i termini.
        </Text>
        <FormControl mb={4} isInvalid={formState.status === 'error'}>
          <Checkbox name="accept">
            <b>Accetto le Condizioni di Servizio</b>
          </Checkbox>
          {formState.errors && <FormErrorMessage>{formState.errors[0].message}</FormErrorMessage>}
        </FormControl>
        <SubmitButton>Continua</SubmitButton>
      </Box>
    </form>
  );
};

export default StepTOS;
