// Chakra imports
import {
  Flex,
  Input,
  Text,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
// Custom components
import React from "react";
import FormLabel from "./FormLabel";

interface DefaultProps {
  id: string;
  label: string;
  extra?: string;
  placeholder: string;
  type?: string;
  mb?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  [key: string]: any; // This allows passing additional props
  errors: string[];
  isRequired?: boolean;
}

const InputField: React.FC<DefaultProps> = (props) => {
  const {
    id,
    label,
    extra,
    placeholder,
    type = "text",
    mb,
    isInvalid = false,
    errorMessage,
    errors,
    onChange,
    isRequired = false,
    ...rest
  } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  return (
    <FormControl isInvalid={errors.length > 0} mb={mb || "30px"} isRequired={isRequired}>
      <FormLabel extra={extra} id={id}>{label}</FormLabel>
      <Input
        {...rest}
        type={type}
        id={id}
        fontWeight="500"
        variant="main"
        placeholder={placeholder}
        _placeholder={{ fontWeight: "400", color: "secondaryGray.600" }}
        h="44px"
        maxH="44px"
      />
      {errors.length > 0 && errors.map(e => <FormErrorMessage key={e}>{e}</FormErrorMessage>)}
    </FormControl>
  );
};

export default InputField;
