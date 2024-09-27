"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { createBusinessTypeAction } from "../createBusinessType.action";

const initialState: string | null = null;

export default function CreateUserPage() {
  const [formState, action] = useFormState(createBusinessTypeAction, initialState);
  const [errors, setErrors] = useState<Record<string, any>[]>([]);
  const [commissionRules, setCommissionRules] = useState([
    { minAmount: '', maxAmount: '', commissionType: '', commissionValue: '' },
  ]);

  // useEffect(() => {
  //   if (formState) {
  //     console.log(formState)
  //     const { issues } = JSON.parse(formState);
  //     setErrors(issues);
  //   }
  // }, [formState]);

  const handleAddCommissionRule = () => {
    setCommissionRules([...commissionRules, { minAmount: '', maxAmount: '', commissionType: '', commissionValue: '' }]);
  };

  const handleRemoveCommissionRule = (index: number) => {
    setCommissionRules(commissionRules.filter((_, i) => i !== index));
  };

  const handleCommissionRuleChange = (index: number, field: string, value: string) => {
    const newRules = [...commissionRules];
    newRules[index][field] = value;
    setCommissionRules(newRules);
  };

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <form action={action} style={{ width: '100%' }}>
      {/* Nome dell'attività */}
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
          Nome dell&apos;attività
          <Text color={brandStars}>*</Text>
        </FormLabel>
        <Input
          isRequired={true}
          fontSize="sm"
          type="text"
          placeholder="Il tuo nome dell'attività"
          fontWeight="500"
          size="lg"
          name="businessTypeName"
        />
        {errors
          .filter((e) => e.path.includes("businessName"))
          .map((m) => (
            <FormErrorMessage key={m.message}>{m.message}</FormErrorMessage>
          ))}
      </FormControl>

      {/* Regole di commissione */}
      <FormLabel fontSize="sm" fontWeight="500" color={textColor} mt="28px">
        Regole di commissione
      </FormLabel>
      {commissionRules.map((rule, index) => (
        <Box key={index} display="flex" alignItems="center" mt="16px">
          <FormControl isInvalid={errors.some((e) => e.path.includes("commissionRules"))}>
            <Box display="flex" alignItems="center">
              <Input
                isRequired={true}
                fontSize="sm"
                type="number"
                placeholder="Importo minimo"
                fontWeight="500"
                size="lg"
                value={rule.minAmount}
                onChange={(e) => handleCommissionRuleChange(index, 'minAmount', e.target.value)}
                name={`commissionRules[${index}].minAmount`}
                mr="4"
              />
              <Input
                fontSize="sm"
                type="number"
                placeholder="Importo massimo (opzionale)"
                fontWeight="500"
                size="lg"
                value={rule.maxAmount}
                onChange={(e) => handleCommissionRuleChange(index, 'maxAmount', e.target.value)}
                name={`commissionRules[${index}].maxAmount`}
                mr="4"
              />
              <Select
                isRequired={true}
                fontSize="sm"
                placeholder="Seleziona tipo"
                fontWeight="500"
                size="lg"
                value={rule.commissionType}
                onChange={(e) => handleCommissionRuleChange(index, 'commissionType', e.target.value)}
                name={`commissionRules[${index}].commissionType`}
                mr="4"
              >
                <option value="fixed">Fisso</option>
                <option value="percentage">Percentuale</option>
              </Select>
              <Input
                isRequired={true}
                fontSize="sm"
                type="number"
                placeholder="Valore della commissione"
                fontWeight="500"
                size="lg"
                value={rule.commissionValue}
                onChange={(e) => handleCommissionRuleChange(index, 'commissionValue', e.target.value)}
                name={`commissionRules[${index}].commissionValue`}
                mr="4"
              />
              <Button
                colorScheme="red"
                onClick={() => handleRemoveCommissionRule(index)}
                style={{ marginLeft: '8px' }}
                width={56}
              >
                Rimuovi
              </Button>
            </Box>
          </FormControl>
        </Box>
      ))}

      <Button
        colorScheme="teal"
        onClick={handleAddCommissionRule}
        style={{ marginTop: '16px' }}
      >
        Aggiungi regola di commissione
      </Button>

      {/* Pulsante di invio */}
      <Button
        type="submit"
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="100%"
        h="50"
        mt="24px"
      >
        Aggiungi Categoria clienti
      </Button>
    </form>
  );
}
