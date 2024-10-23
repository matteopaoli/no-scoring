"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { ReactNode, useActionState, useEffect, useState } from "react";
import { updateBusinessTypeAction } from "../../updateBusinessType.action"; // Replace with your update business type action
import { BusinessType, CommissionRule } from "@/app/db";

type UpdateBusinessTypePageProps = {
  existingBusinessType: BusinessType;
  existingCommissionRules: CommissionRule[];
};

export default function UpdateBusinessTypePage({
  existingBusinessType,
  existingCommissionRules,
}: UpdateBusinessTypePageProps) {
  const [formState, action] = useActionState(updateBusinessTypeAction, null);
  const [errors, setErrors] = useState<Record<string, any>[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(existingCommissionRules);

  useEffect(() => {
    if (formState) {
      const { issues } = JSON.parse(formState);
      setErrors(issues);
    }
  }, [formState]);

  const handleAddCommissionRule = () => {
    setCommissionRules([...commissionRules, { minAmount: 0, maxAmount: null, commissionType: '', commissionValue: 0 }]);
  };

  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <form action={action} style={{ width: "100%" }}>
      <FormControl isInvalid={errors.some((e) => e.path.includes("businessTypeName"))}>
        <FormLabel
          display="flex"
          ms="4px"
          fontSize="sm"
          fontWeight="500"
          color={textColor}
          mb="8px"
          mt="24px"
        >
          Business Type Name
          <Text color={brandStars}>*</Text>
        </FormLabel>
        <Input
          isRequired={true}
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="Business Type Name"
          defaultValue={existingBusinessType.name}
          fontWeight="500"
          size="lg"
          name="businessTypeName"
        />
        {errors
          .filter((e) => e.path.includes("businessTypeName"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>

      {commissionRules.map((rule, index) => (
        <FormControl key={index} mt={4} isInvalid={errors.some((e) => e.path.includes(`commissionRules[${index}]`))}>
          <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
            Commission Rule {index + 1}
          </FormLabel>
          <NumberInput defaultValue={rule.minAmount}>
            <NumberInputField name={`commissionRules[${index}].minAmount`} placeholder="Min Amount" />
          </NumberInput>
          <NumberInput defaultValue={rule.maxAmount ?? ""}>
            <NumberInputField name={`commissionRules[${index}].maxAmount`} placeholder="Max Amount" />
          </NumberInput>
          <Input
            defaultValue={rule.commissionType}
            placeholder="Commission Type"
            name={`commissionRules[${index}].commissionType`}
          />
          <NumberInput defaultValue={rule.commissionValue}>
            <NumberInputField name={`commissionRules[${index}].commissionValue`} placeholder="Commission Value" />
          </NumberInput>
          {errors
            .filter((e) => e.path.includes(`commissionRules[${index}]`))
            .map((m) => (
              <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
            ))}
        </FormControl>
      ))}

      <Button onClick={handleAddCommissionRule} fontSize="sm" variant="outline" mt="4">
        Add Commission Rule
      </Button>

      <Button type="submit" fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mt="24px">
        Update Business Type
      </Button>
    </form>
  );
}
