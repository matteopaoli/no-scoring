"use client";

import {
  FormLabel as ChakraFormLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

type FormLabelProps = {
  children: string;
  extra?: string;
  id: string;
};

export default function FormLabel({ children, extra, id }: FormLabelProps) {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  return (
    <ChakraFormLabel
      display="flex"
      ms="10px"
      htmlFor={id}
      fontSize="sm"
      color={textColorPrimary}
      fontWeight="bold"
      _hover={{ cursor: "pointer" }}
    >
      {children}
      {extra && (
        <Text fontSize="sm" fontWeight="400" ms="2px">
          {extra}
        </Text>
      )}
    </ChakraFormLabel>
  );
}
