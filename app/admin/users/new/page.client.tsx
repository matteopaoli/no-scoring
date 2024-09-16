"use client";

import { useDictionary } from "@/app/[lang]/DictionaryProvider";
import { HSeparator } from "@/app/components/separator/Separator";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { FcGoogle } from "react-icons/fc";
import { RiEyeCloseLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "@chakra-ui/next-js";
import { z } from "zod";
import createUserAction from "./createUser.action";

const initialState: string | null = null;

type CreateUserPageProps = {
  businessTypesOptions: ReactNode[];
};

export default function createUserPage({
  businessTypesOptions,
}: CreateUserPageProps) {
  const [formState, action] = useFormState(createUserAction, initialState);
  const [errors, setErrors] = useState<Record<string, any>[]>([])

  useEffect(() => {
    if (formState) {
      const { issues } = JSON.parse(formState)
      console.log(issues)
      setErrors(issues)
    }

  }, [formState])

  console.log(formState)

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <Box>
      <Flex
        maxW={{ base: "100%" }}
        w="100%"
        // mx={{ base: "auto", lg: "0px" }}
        // me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box width={{ base: "100%", md: "500px" }} mx="auto">
          <form action={action}>
            <FormControl isInvalid={errors.some(e => e.path.includes('email'))}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="24px"
              >
                Email
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@email.com"
                fontWeight="500"
                size="lg"
                name="email"
              />
              {errors.filter(e => e.path.includes('email')).map(m => <FormErrorMessage>{m.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isInvalid={errors.some(e => e.path.includes('email'))}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="24px"
              >
                Nome azienda
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="text"
                placeholder="Pinco Pallino s.r.l."
                fontWeight="500"
                size="lg"
                name="businessName"
              />
              {errors.filter(e => e.path.includes('email')).map(m => <FormErrorMessage>{m.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isInvalid={errors.some(e => e.path.includes('businessTypeId'))}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="24px"
              >
                Tipo Business
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                isRequired={true}
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Seleziona uno"
                mb="24px"
                fontWeight="500"
                size="lg"
                name="businessType"
              >
                {businessTypesOptions}
              </Select>
              {errors.filter(e => e.path.includes('businessTypeId')).map(m => <FormErrorMessage>{m.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isInvalid={errors.some(e => e.path.includes('stripeApiKey'))}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="24px"
              >
                Stripe API Token
                <Text color={brandStars}>*</Text>
              </FormLabel>
              <Textarea
                isRequired={true}
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Stripe API Token"
                fontWeight="500"
                size="lg"
                name="stripeApiKey"
              />
              {errors.filter(e => e.path.includes('stripeApiKey')).map(m => <FormErrorMessage>{m.message}</FormErrorMessage>)}
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
              Aggiungi utente
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
}
