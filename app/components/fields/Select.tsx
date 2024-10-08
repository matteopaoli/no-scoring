// Chakra imports
import {
  Flex,
  FormLabel,
  Select,
  Text,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
// Custom components
import React, { ReactNode } from "react";

interface SelectProps {
  id: string;
  label: string;
  extra?: string;
  placeholder: string;
  mb?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  [key: string]: any; // This allows passing additional props
  errors: string[];
  children: ReactNode[];
  name: string;
}

const SelectComponent: React.FC<SelectProps> = (props) => {
  const {
    id,
    label,
    extra,
    placeholder,
    mb,
    isInvalid = false,
    errorMessage,
    errors,
    children,
    name,
    ...rest
  } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray", "white");

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
      <Select
        {...rest}
        name={name}
        id={id}
        placeholder={placeholder}
        variant="main"
        h="44px"
        maxH="44px"
      >
      {children}
      </Select>
      {errors.length > 0 && errors.map(e => <FormErrorMessage key={e}>{e}</FormErrorMessage>)}
    </FormControl>
  );
};

export default SelectComponent;
