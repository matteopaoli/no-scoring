// Chakra imports
import {
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
// Custom components
import React from "react";

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
  errors: string[]
}

const Default: React.FC<DefaultProps> = (props) => {
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
    ...rest
  } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  return (
    <FormControl isInvalid={errors.length > 0} mb={mb || "30px"}>
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: "pointer" }}
      >
        {label}
        {extra && (
          <Text fontSize="sm" fontWeight="400" ms="2px">
            {extra}
          </Text>
        )}
      </FormLabel>
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

export default Default;
