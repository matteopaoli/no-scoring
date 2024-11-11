"use client";
import React from "react";
// Chakra imports
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
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "@/app/components/separator/Separator";
import DefaultAuth from "@/app/layouts/admin/Auth";
// Assets
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import login from "./login.action";
import { Link } from "@chakra-ui/next-js";
import { useDictionary } from "@/app/DictionaryProvider";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation"; // Add this import
import Callout from "@/app/components/Callout";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: Record<string, any> = {};

export default function SignIn() {
  const t = useDictionary();
  const [formState, action] = useFormState(login, initialState);
  const searchParams = useSearchParams();
  const onboardingComplete = searchParams.get("onboarding-complete") === "true"; // Check for the query param

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
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <DefaultAuth>
      <Callout autoDismiss={true} dismissDuration={5000} />
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        {onboardingComplete && ( // Conditionally render the alert
          <Alert status="success" mb="20px">
            <AlertIcon />
            Procedura di onboarding completata. Per favore autenticati di nuovo.
          </Alert>
        )}
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            {t("signIn")}
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            {t("enterEmailPassword")}
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form action={action}>
            <FormControl isInvalid={formState?.error}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                {t("email")}
                <Text color={brandStars}>{t("requiredField")}</Text>
              </FormLabel>
              <Input
                isRequired={true}
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="Inserisci email"
                mb="24px"
                fontWeight="500"
                size="lg"
                name="email"
                data-testid="mt-email-field"
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                {t("password")}
                <Text color={brandStars}>{t("requiredField")}</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="**********"
                  size="lg"
                  type={show ? "text" : "password"}
                  name="password"
                  data-testid="mt-password-field"
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {formState?.error ? (
                <FormErrorMessage>
                  {t("wrongCredentialsMessage")}
                </FormErrorMessage>
              ) : null}
              <SubmitButton w="100%" loadingText="Accesso in corso" data-testid="mt-login-button">
                {t("signIn")}
              </SubmitButton>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
