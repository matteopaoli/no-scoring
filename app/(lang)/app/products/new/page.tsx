"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const initialState: string | null = null;

export default function CreateOrEditProductPage() {
  const [errors, setErrors] = useState<Record<string, any>[]>([]);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");


  return (
    <Box width={{ base: '100%', md: '500px' }}>
      <form /*action={action}*/ style={{ width: '100%' }}>
        <FormControl isInvalid={errors.some((e) => e.path.includes("name"))}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt="24px"
          >
            Nome Prodotto
            <Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="text"
            placeholder="Nome del prodotto"
            fontWeight="500"
            size="lg"
            name="name"
          />
          {errors
            .filter((e) => e.path.includes("name"))
            .map((m) => (
              <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
            ))}
        </FormControl>

        <FormControl isInvalid={errors.some((e) => e.path.includes("description"))}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt="24px"
          >
            Descrizione
            <Text color={brandStars}>*</Text>
          </FormLabel>
          <Textarea
            isRequired={true}
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            placeholder="Descrizione del prodotto"
            fontWeight="500"
            size="lg"
            name="description"
          />
          {errors
            .filter((e) => e.path.includes("description"))
            .map((m) => (
              <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
            ))}
        </FormControl>

        <FormControl isInvalid={errors.some((e) => e.path.includes("price"))}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt="24px"
          >
            Prezzo
            <Text color={brandStars}>*</Text>
          </FormLabel>
          <Input
            isRequired={true}
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="number"
            placeholder="Prezzo"
            fontWeight="500"
            size="lg"
            name="price"
          />
          {errors
            .filter((e) => e.path.includes("price"))
            .map((m) => (
              <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
            ))}
        </FormControl>

        <FormControl isInvalid={errors.some((e) => e.path.includes("image"))}>
          <FormLabel
            display="flex"
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            mb="8px"
            mt="24px"
          >
            Immagine del Prodotto
          </FormLabel>
          <Input
            fontSize="sm"
            ms={{ base: "0px", md: "0px" }}
            type="file"
            accept="image/*"
            fontWeight="500"
            size="lg"
            name="image"
          />
          {errors
            .filter((e) => e.path.includes("image"))
            .map((m) => (
              <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
            ))}
        </FormControl>

        <Button
          type="submit"
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="24px"
        >
          Salva prodotto
        </Button>
      </form>
    </Box>
  );
}
