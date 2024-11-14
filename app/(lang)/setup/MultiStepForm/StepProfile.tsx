import type React from "react";
import { Box, Button } from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { updateProfileAction } from "../updateProfile.action";
import InputField from "@/app/components/fields/InputField";
import getFormErrors from "@/app/utils/getFormErrors";
import ProfileImageInput from "@/app/components/fields/ProfileImageInput";

interface StepProfileProps {
  onNext: () => void;
  session: any; // Adjust type as needed for session
}

const StepProfile: React.FC<StepProfileProps> = ({ onNext, session }) => {
  const [profileFormState, updateProfile] = useFormState(
    updateProfileAction,
    []
  );

  return (
    <form action={updateProfile} onSubmit={onNext}>
      <Box width="full">
        <InputField
          id="firstName"
          label="Nome"
          name="firstName"
          placeholder="Inserisci il tuo nome"
          isRequired
          errors={getFormErrors(profileFormState, "firstName")}
        />
        <InputField
          id="lastName"
          label="Cognome"
          name="lastName"
          placeholder="Inserisci il tuo cognome"
          isRequired
          errors={getFormErrors(profileFormState, "lastName")}
        />
        <ProfileImageInput
          id="profileImage"
          name="profileImage"
          label="Immagine Profilo"
        />
        <Button type="submit">Salva e Continua</Button>
      </Box>
    </form>
  );
};

export default StepProfile;
