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
import React, { useState } from "react";

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
    onChange,
    ...rest
  } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow keys: backspace (8), delete (46), left arrow (37), right arrow (39), comma (188 or 44)
    // And numeric keys (48-57 for digits 0-9 on standard keyboard, 96-105 for numpad digits)
    if (
      !(
        (event.key >= '0' && event.key <= '9') || // Allow digits
        event.key === ',' || // Allow comma
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight'
      )
    ) {
      event.preventDefault();
      return
    }
  };


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
        onKeyDown={handleKeyDown}
        onChange={onChange}
      />
      {errors.length > 0 &&
        errors.map((e) => <FormErrorMessage key={e}>{e}</FormErrorMessage>)}
    </FormControl>
  );
};

export default Default;
