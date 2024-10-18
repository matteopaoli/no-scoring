import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { createStoreAction } from "../createStore.action";
import { UserContext } from "@/app/contexts/UserContext";
import ProfileImageInput from "@/app/components/fields/ProfileImageInput";
import InputField from "@/app/components/fields/InputField";
import SubmitButton from "@/app/components/SubmitButton";
import getFormErrors from "@/app/utils/getFormErrors";

const StepStore: React.FC = () => {
  const [errors, action] = useFormState(createStoreAction, []);
  const [storeErrors, setStoreErrors] = useState<any[]>([]); // Use a more specific type if available
  const session = useContext(UserContext);

  const isFieldInvalid = (field: string) =>
    storeErrors?.some((e) => e.path.includes(field)) ?? false;

  return (
    <form action={action} method="post">
      <Box width="full">
        <InputField
          label="Nome Negozio"
          id="store-name"
          name="storeName"
          errors={getFormErrors(errors, "storeName")}
          placeholder="Inserisci il nome del negozio"
        />
        <ProfileImageInput
          name="storeLogo"
          label="Immagine Profilo"
          id="store-logo"
        />
        <input type="hidden" value={session!.user!.email!} name="email" />
        <SubmitButton>Crea Negozio</SubmitButton>
      </Box>
    </form>
  );
};

export default StepStore;
