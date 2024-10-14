// components/Callout.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';

interface CalloutProps {
  autoDismiss?: boolean; // Whether the alert should automatically disappear after a few seconds
  dismissDuration?: number; // Time in milliseconds before auto-dismiss
}

// Full message strings for actions in Italian
const actionMessages: Record<string, string> = {
  createProduct: 'Il prodotto è stato creato con successo.',
  update: 'Il prodotto è stato aggiornato con successo.',
  process: 'Il prodotto è stato elaborato con successo.',
};

const Callout: React.FC<CalloutProps> = ({
  autoDismiss = true,
  dismissDuration = 5000, // Default to 5 seconds
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const action = searchParams.get('action');
  const error = searchParams.get('error');

  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (success === 'true') {
      setStatus('success');
      setTitle('Successo!');
      setDescription(actionMessages[action as keyof typeof actionMessages] || 'Operazione completata con successo.');
      setIsVisible(true);
    } else if (error === 'true') {
      setStatus('error');
      setTitle('Errore!');
      setDescription('C\'è stato un errore durante l\'elaborazione della tua richiesta. Per favore riprova.');
      setIsVisible(true);
    }
  }, [success, error, action]);

  useEffect(() => {
    if (isVisible && autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Optionally, clear the query parameters from the URL once the alert is dismissed.
        const params = new URLSearchParams(searchParams.toString());
        params.delete('success');
        params.delete('error');
        params.delete('action');
        router.replace(`?${params.toString()}`);
      }, dismissDuration);

      return () => clearTimeout(timer); // Cleanup on component unmount
    }
  }, [isVisible, autoDismiss, dismissDuration, searchParams, router]);

  if (!isVisible) return null;

  return (
    <Alert status={status} variant="subtle" mb={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Box>
      <CloseButton position="absolute" right="8px" top="8px" onClick={() => setIsVisible(false)} />
    </Alert>
  );
};

export default Callout;
