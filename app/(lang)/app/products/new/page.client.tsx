"use client";

import {
  Box,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
  Checkbox,
  Text,
  Spinner,
} from "@chakra-ui/react";

import createProduct from "../createProduct.action";
import { useFormState, useFormStatus } from "react-dom";
import InputField from "@/app/components/fields/InputField"; // Import the InputField component
import TextArea from "@/app/components/fields/TextArea"; // Import the TextArea component
import ImageInput from "@/app/components/fields/ImageInput";
import getFormErrors from "@/app/utils/getFormErrors";
import PriceInput from "@/app/components/fields/PriceField";
import { useState } from "react";
import SubmitButton from "../../../../components/SubmitButton";
import { getAmountWithFees } from "@/app/utils/fees";

type ClientPageProps = {
    storeImage?: string
}

export default function Client({ storeImage }: ClientPageProps) {
  const [errors, action] = useFormState(createProduct, []);
  const { pending } = useFormStatus()
  const [includeCommission, setIncludeCommission] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);

  const handlePriceChange = (event) => {
    const price = parseFloat(event.target.value.replace(',', '.')) || 0;
    setFinalPrice(getAmountWithFees(price));
  };

  const handleSubmit = async (formData: FormData) => {
    if (includeCommission) {
      formData.set("price", finalPrice.toFixed(2));
    }
    await action(formData);
  };

  return (
    <Box width={{ base: "100%" }} pl={{ md: "24px" }}>
      <form action={handleSubmit} style={{ width: "100%" }}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: '1fr 1fr 1fr' }} gap={6}>
          <GridItem>
            <InputField
              id="product-name"
              label="Nome Prodotto"
              name="name"
              placeholder="Nome del prodotto"
              isRequired={true}
              errors={getFormErrors(errors, 'name')}
            />

            <PriceInput
              id="product-price"
              label="Prezzo"
              name="price"
              type="text"
              placeholder="Prezzo"
              isRequired={true}
              errors={getFormErrors(errors, 'price')}
              onChange={handlePriceChange}
            />

            {/* Product Description Field (using TextArea) */}
            <TextArea
              id="product-description"
              label="Descrizione"
              name="description"
              placeholder="Descrizione del prodotto"
              isRequired={true}
              errors={getFormErrors(errors, 'description')}
            />

            <Checkbox
              isChecked={includeCommission}
              onChange={() => setIncludeCommission(!includeCommission)}
              mt={4}
              name="includeCommission"
              value="yes"
            >
              <Text as="span">Commissioni a carico del cliente</Text>
            </Checkbox>
            {includeCommission && (
              <Text mt={2}>
                Prezzo finale: €{finalPrice.toFixed(2)}
              </Text>
            )}
          </GridItem>
          <GridItem>
            <ImageInput
              name="image"
              label="Immagine Prodotto"
              id="product-image"
              defaultImage={storeImage ?? undefined}
            />
            <Text fontSize="xs" mt={2}>Puoi sostituire l&apos;immagine di default con una personalizzata</Text>
          </GridItem>
        </Grid>
        <SubmitButton>Salva Prodotto</SubmitButton>
      </form>
    </Box>
  );
}
