// Chakra imports
import {
  Flex,
  FormLabel,
  Textarea,
  Text,
  useColorModeValue,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
// Custom components
import React from "react";

interface TextAreaProps {
  id: string;
  label: string;
  extra?: string;
  placeholder?: string;
  isRequired?: boolean;
  errors: string[];
  mb?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  extra,
  placeholder,
  isRequired = false,
  mb,
  name,
  errors,
  defaultValue,
  value,
  onChange,
}) => {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  return (
    <Flex direction='column' mb={mb ? mb : "30px"}>
      <FormControl isInvalid={errors.length > 0}>
        <FormLabel
          display='flex'
          ms='10px'
          htmlFor={id}
          fontSize='sm'
          color={textColorPrimary}
          fontWeight='bold'
          _hover={{ cursor: "pointer" }}
        >
          {label}
          {extra && (
            <Text fontSize='sm' fontWeight='400' ms='2px'>
              {extra}
            </Text>
          )}
        </FormLabel>
        <Textarea
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          name={name}
          id={id}
          placeholder={placeholder}
          isRequired={isRequired}
          isInvalid={errors.length > 0}
          variant="main"
          borderColor={"secondaryGray.100"}
          borderRadius="16px"
          borderWidth="1px"
          _placeholder={{ color: "secondaryGray.600", fontWeight: "400" }}
          resize='none' // Disable resizing
          h='44px' // Set height to match InputField
          maxH='44px' // Prevent vertical resizing beyond this height
        />
        {errors.length > 0 && errors.map(e => <FormErrorMessage key={e}>{e}</FormErrorMessage>)}
      </FormControl>
    </Flex>
  );
};

export default TextArea;
