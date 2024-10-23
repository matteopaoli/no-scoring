import React, { useState, useEffect, useActionState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { updateProfileAction } from '../updateProfile.action';
import { UserContext } from '@/app/contexts/UserContext';

interface StepProfileProps {
  onNext: () => void;
  session: any; // Adjust type as needed for session
}

const StepProfile: React.FC<StepProfileProps> = ({ onNext, session }) => {
  const [profileFormState, updateProfile] = useActionState(updateProfileAction, { success: false, issues: [] });
  const [profileErrors, setProfileErrors] = useState<any[]>([]); // Use a more specific type if available

  useEffect(() => {
    if (profileFormState) {
      const { issues } = profileFormState
      setProfileErrors(issues);
    }
  }, [profileFormState]);

  const isFieldInvalid = (field: string) => profileErrors.some((e) => e.path.includes(field));

  return (
    <form action={updateProfile} onSubmit={onNext}>
      <Box width="full">
        <FormControl mb={4} isInvalid={isFieldInvalid("firstName")}>
          <FormLabel>Nome</FormLabel>
          <Input name="firstName" placeholder="Inserisci il tuo nome" />
          {profileErrors.filter((e) => e.path.includes("firstName")).map((m) => (
            <FormErrorMessage key={m.path}>{m.message}</FormErrorMessage>
          ))}
        </FormControl>
        <FormControl mb={4} isInvalid={isFieldInvalid("lastName")}>
          <FormLabel>Cognome</FormLabel>
          <Input name="lastName" placeholder="Inserisci il tuo cognome" />
          {profileErrors.filter((e) => e.path.includes("lastName")).map((m) => (
            <FormErrorMessage key={m.path}>{m.message}</FormErrorMessage>
          ))}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Immagine Profilo</FormLabel>
          <Input type="file" name="profileImage" />
        </FormControl>
        <Button type="submit">Salva e Continua</Button>
        <input type="hidden" value={session!.user!.email!} name="email" />
      </Box>
    </form>
  );
};

export default StepProfile;
