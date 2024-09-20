import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useFormState } from 'react-dom';
import { createStoreAction } from '../createStore.action';
import { UserContext } from '@/app/contexts/UserContext';

const StepStore: React.FC = () => {
  const [storeFormState, createStore] = useFormState(createStoreAction, { success: false, issues: [] });
  const [storeErrors, setStoreErrors] = useState<any[]>([]); // Use a more specific type if available
  const session = useContext(UserContext)

  useEffect(() => {
    if (storeFormState) {
      console.log(storeFormState)
      setStoreErrors(storeFormState?.issues ?? []);
    }
  }, [storeFormState]);

  const isFieldInvalid = (field: string) => storeErrors?.some((e) => e.path.includes(field)) ?? false;

  return (
    <form action={createStore} method="post">
      <Box width="full">
        <FormControl mb={4} isInvalid={isFieldInvalid("storeName")}>
          <FormLabel>Nome Negozio</FormLabel>
          <Input name="storeName" placeholder="Inserisci il nome del negozio" />
          {storeErrors.filter((e) => e.path.includes("storeName")).map((m) => (
            <FormErrorMessage key={m.path}>{m.message}</FormErrorMessage>
          ))}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Logo Negozio</FormLabel>
          <Input type="file" name="storeLogo" />
        </FormControl>
        <input type="hidden" value={session!.user!.email!} name="email" />
        <Button type="submit">Crea Negozio</Button>
      </Box>
    </form>
  );
};

export default StepStore;
