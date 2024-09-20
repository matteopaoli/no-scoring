"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Center, Heading, Progress, Spinner, VStack } from '@chakra-ui/react';
import { checkProfileCompletion } from '../checkProfileCompletion.action';
import { UserContext } from '@/app/contexts/UserContext';
import StepIntroduction from './StepIntroduction';
import StepProfile from './StepProfile';
import StepStore from './StepStore';

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useContext(UserContext);

  useEffect(() => {
    const checkCompletion = async () => {
      const profileCompleted = await checkProfileCompletion(session!.user!.email!);
      if (profileCompleted) {
        setStep(3); // If profile is complete, skip to final step
      }
      setLoading(false);
    };
    checkCompletion();
  }, [session]);

  if (loading) return <Spinner />;

  return (
    <Center minHeight="100vh">
      <VStack spacing={8} width="full" maxW="md" p={8} boxShadow="lg" borderRadius="md">
        <Heading as="h2" size="lg">
          {step === 1 && 'Benvenuto in PayTomorrow'}
          {step === 2 && 'Dettagli Profilo'}
          {step === 3 && 'Creazione Negozio'}
        </Heading>
        
        <Progress value={step * 33.33} width="100%" />

        {step === 1 && <StepIntroduction onNext={() => setStep(2)} />}
        {step === 2 && <StepProfile onNext={() => setStep(3)} session={session} />}
        {step === 3 && <StepStore />}
      </VStack>
    </Center>
  );
};

export default MultiStepForm;
