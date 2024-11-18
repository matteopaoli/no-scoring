"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Center,
  Flex,
  Heading,
  Progress,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { checkProfileCompletion } from "../checkProfileCompletion.action";
import { UserContext } from "@/app/contexts/UserContext";
import StepIntroduction from "./StepIntroduction";
import StepTOS from "./StepTOS"; // New step component
import StepProfile from "./StepProfile";
import StepStore from "./StepStore";

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useContext(UserContext);

  useEffect(() => {
    const checkCompletion = async () => {
      const step = await checkProfileCompletion(session!.user!.email!);
      setStep(step);
      setLoading(false);
    };
    checkCompletion();
  }, [session]);

  if (loading)
    return (
      <Flex w="100%" h="100dvh" alignItems="center" justifyContent="center">
        <Spinner color="brand.500" size="xl" />
      </Flex>
    );

  return (
    <Center minHeight="100vh">
      <VStack
        spacing={8}
        width="full"
        maxW="xl"
        p={8}
        boxShadow="lg"
        borderRadius="md"
        background="white"
      >
        <Progress value={step * 25} width="100%" colorScheme="brand" />
        <Heading as="h2" size="lg" textAlign="center">
          {step === 1 && "Benvenuto in PayTomorrow"}
          {step === 2 && "Accettazione TOS"}
          {step === 3 && "Dettagli Profilo"}
          {step === 4 && "Creazione Negozio"}
        </Heading>

        {step === 1 && <StepIntroduction onNext={() => setStep(2)} />}
        {step === 2 && (
          <StepTOS
            onAccept={() => {
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <StepProfile onNext={() => setStep(4)} session={session} />
        )}
        {step === 4 && <StepStore />}
      </VStack>
    </Center>
  );
};

export default MultiStepForm;
