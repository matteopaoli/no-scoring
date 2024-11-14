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
import ProfileImageInput from "@/app/components/fields/ProfileImageInput";
import InputField from "@/app/components/fields/InputField";
import SubmitButton from "@/app/components/SubmitButton";
import getFormErrors from "@/app/utils/getFormErrors";
import ImageInput from "@/app/components/fields/ImageInput";

const StepStore: React.FC = () => {
  const [errors, action] = useFormState(createStoreAction, []);

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
        <ImageInput name="storeLogo" label="Immagine Negozio" id="store-logo" hideDefaultImage />
        <SubmitButton>Crea Negozio</SubmitButton>
      </Box>
    </form>
  );
};

export default StepStore;
