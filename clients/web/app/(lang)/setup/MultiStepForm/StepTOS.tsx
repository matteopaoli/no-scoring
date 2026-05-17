"use client";

import React, { useEffect, useState, useActionState } from "react";
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

interface StepTOSProps {
  onAccept: () => void;
}

const StepTOS: React.FC<StepTOSProps> = ({ onAccept }) => {
  const [formState, action] = useActionState(acceptTosAction, {});

  useEffect(() => {
    if (formState.status === "success") {
      onAccept();
    }
  }, [formState]);

  return (
    <form action={action}>
      <Box width="full">
        <Text fontSize="lg" mb={4}>
          L&apos;utente dichiara di accettare le{" "}
          <Link
            color="brand.600"
            textDecoration="underline"
            href="https://drive.google.com/file/d/15BHXZWrz6ZyOXqmD_dvVo6ARWKOdiEYA/view?usp=drive_link"
            target="_blank"
            rel="nofollow"
          >
            Condizioni Contrattuali
          </Link>{" "}
          e di essere consapevole di quanto segue:
          <br />
          <br />
          Tutte le informazioni mostrate su questa piattaforma derivano
          esclusivamente dal proprio account Stripe, al quale noi non abbiamo
          accesso diretto. Eventuali rimborsi ai clienti sono interamente
          gestibili dall&apos;utente e sono regolati dai nostri partner tecnologici
          Stripe e Klarna, i quali definiscono le rispettive condizioni di
          rimborso.
          <br />
          <br />
          Spuntando questa opzione, l&apos;utente conferma di essere consapevole che
          la nostra è una società di software e che l&apos;uso della piattaforma
          attiva una prova gratuita di 14 giorni, al termine della quale
          scatterà un abbonamento annuale a pagamento.
          <br />
          <br />
          L&apos;utente accetta inoltre che le commissioni di servizio e quelle
          stabilite dai partner tecnologici verranno addebitate sin dall&apos;inizio
          dell&apos;utilizzo.
          <br />
          <br />
          Confermando questo disclaimer, l&apos;utente prende atto e accetta tutte le
          condizioni descritte.
        </Text>
        <FormControl mb={4} isInvalid={formState.status === "error"}>
          <Checkbox name="accept">
            <b>Accetto il disclaimer e le Condizioni di Servizio</b>
          </Checkbox>
          {formState.errors && (
            <FormErrorMessage>{formState.errors[0].message}</FormErrorMessage>
          )}
        </FormControl>
        <SubmitButton>Continua</SubmitButton>
      </Box>
    </form>
  );
};

export default StepTOS;
