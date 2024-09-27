"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import updateUserAction from "./updateUser.action"; // Replace with your update user action
import { User } from "@/app/db";

const initialState: string | null = null;

type UpdateUserPageProps = {
  businessTypesOptions: ReactNode[];
  existingUser: User
};

export default function UpdateUserPage({
  businessTypesOptions,
  existingUser,
}: UpdateUserPageProps) {
  const [formState, action] = useFormState(updateUserAction, initialState);
  const [errors, setErrors] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (formState) {
      const { issues } = JSON.parse(formState);
      console.log(issues);
      setErrors(issues);
    }
  }, [formState]);

  console.log(formState);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <form action={action} style={{ width: '100%' }}>
      {/* Email is read-only */}
      <FormControl isInvalid={errors.some((e) => e.path.includes("email"))}>
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
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="email"
          value={existingUser.email}
          readOnly={true} // Email cannot be changed
          fontWeight="500"
          size="lg"
          name="email"
        />
        {errors
          .filter((e) => e.path.includes("email"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>

      <FormControl isInvalid={errors.some((e) => e.path.includes("businessName"))}>
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
          defaultValue={existingUser.businessName}
          fontWeight="500"
          size="lg"
          name="businessName"
        />
        {errors
          .filter((e) => e.path.includes("businessName"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>

      <FormControl
        isInvalid={errors.some((e) => e.path.includes("businessTypeId"))}
      >
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
          defaultValue={existingUser.businessTypeId}
        >
          {businessTypesOptions}
        </Select>
        {errors
          .filter((e) => e.path.includes("businessTypeId"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>

      <FormControl
        isInvalid={errors.some((e) => e.path.includes("stripeApiKey"))}
      >
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
          defaultValue={existingUser.stripeSecretKey}
          fontWeight="500"
          size="lg"
          name="stripeApiKey"
        />
        {errors
          .filter((e) => e.path.includes("stripeApiKey"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>
      <FormControl
        isInvalid={errors.some((e) => e.path.includes("stripeUserId"))}
      >
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          color={textColor}
          mb="8px"
          mt="24px"
        >
          ID Stripe Utente
          <Text color={brandStars}>*</Text>
        </FormLabel>
        <Input
          isRequired={true}
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          placeholder="Stripe API Token"
          fontWeight="500"
          size="lg"
          defaultValue={existingUser.stripeUserId}
          name="stripeUserId"
        />
        {errors
          .filter((e) => e.path.includes("stripeUserId"))
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
        Aggiorna utente
      </Button>
    </form>
  );
}
