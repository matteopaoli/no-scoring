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
import { useFormState } from "react-dom";
import { useDictionary } from "@/app/DictionaryProvider";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: { error?: string } | undefined = {};

export default function SignIn() {
  const t = useDictionary();
  const [formState, action] = useFormState(login, initialState);

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
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto" }}
        me="auto"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        mt={{ base: "40px", md: "14vh" }}
        px={{ base: "25px", md: "0px" }}
        p={{ md: "50px" }}
        borderRadius={12}
        bgColor="white"
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            {t("signIn")} (Partner)
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
            <FormControl isInvalid={Boolean(formState?.error)}>
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
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                name="email"
                data-testid="pr-email-field"
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
                  data-testid="pr-password-field"
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
              <Flex justifyContent="space-between" align="center" my="24px">
                {/* <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  {t('keepMeLoggedIn')}
                </FormLabel>
              </FormControl>
              */}
                <Link href="/login/forgot-password">
                  <Text
                    color={textColorBrand}
                    fontSize="sm"
                    maxW="154px"
                    fontWeight="500"
                  >
                    {t("forgotPassword")}
                  </Text>
                </Link>
              </Flex>
              <SubmitButton
                w="100%"
                loadingText="Accesso in corso"
                data-testid="pr-login-button"
              >
                {t("signIn")}
              </SubmitButton>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
