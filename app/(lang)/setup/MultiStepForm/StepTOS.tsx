"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { UserContext } from "@/app/contexts/UserContext";
import { Link } from "@chakra-ui/next-js";

interface StepTOSProps {
  onAccept: () => void;
}

const StepTOS: React.FC<StepTOSProps> = ({ onAccept }) => {
  const session = useContext(UserContext);
  const [TOSAccepted, setTOSAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State to handle errors if any

  const handleAcceptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTOSAccepted(event.target.checked);
    if (error) {
      setError(null); // Clear error when checkbox is checked
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!TOSAccepted) {
      setError("Devi accettare i termini di servizio per continuare.");
      return;
    }
    onAccept();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box width="full">
        <Text fontSize="lg" mb={4}>
          Leggi attentamente i <Link color="brand.600" textDecoration="underline" href="https://paytomorrow.it/doc" target="_blank" rel="nofollow">termini e le condizioni di utilizzo</Link>. Accettando
          le Condizioni di Servizio, dichiari di aver compreso e accettato i
          termini.
        </Text>
        <FormControl mb={4} isInvalid={!!error}>
          <Checkbox isChecked={TOSAccepted} onChange={handleAcceptChange}>
            Accetto le Condizioni di Servizio
          </Checkbox>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button type="submit" colorScheme="brand" mt={4}>
          Continua
        </Button>
      </Box>
    </form>
  );
};

export default StepTOS;
