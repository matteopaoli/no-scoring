"use client";

import { Box, GridItem, Checkbox, Text, SimpleGrid } from "@chakra-ui/react";

import createProduct from "../createProduct.action";
import InputField from "@/app/components/fields/InputField"; // Import the InputField component
import TextArea from "@/app/components/fields/TextArea"; // Import the TextArea component
import ImageInput from "@/app/components/fields/ImageInput";
import getFormErrors from "@/app/utils/getFormErrors";
import PriceInput from "@/app/components/fields/PriceField";
import { useState, useActionState } from "react";
import SubmitButton from "../../../../components/SubmitButton";
import { getAmountWithFees } from "@/app/utils/fees";
import { FEES_DISCLAIMER } from "@/app/constants";

type ClientPageProps = {
  storeImage?: string;
};

export default function Client({ storeImage }: ClientPageProps) {
  const [errors, action] = useActionState(createProduct, []);
  const [includeCommission, setIncludeCommission] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [description, setDescription] = useState("");

  const handlePriceChange = (event) => {
    const price = parseFloat(event.target.value.replace(",", ".")) || 0;
    setFinalPrice(getAmountWithFees(price));
  };

  const handleSubmit = async (formData: FormData) => {
    if (includeCommission) {
      formData.set("price", finalPrice.toFixed(2));
    }
    await action(formData);
  };

  const handleIncludeFeeChange = (event) => {
    setIncludeCommission(!includeCommission);
    if (!includeCommission && description === '') {
      setDescription(FEES_DISCLAIMER);
    }
  }


  return (
    <Box
      px={{ base: "24px" }}
      py={{ base: "24px", lg: "50px" }}
      mt={{ base: "50px", md: 0 }}
      background="white"
      borderRadius="lg"
      maxW="1200px"
    >
      <form action={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <GridItem>
            <InputField
              id="product-name"
              label="Nome Prodotto"
              name="name"
              placeholder="Nome del prodotto"
              isRequired={true}
              errors={getFormErrors(errors, "name")}
            />

            <PriceInput
              id="product-price"
              label="Prezzo"
              name="price"
              type="text"
              placeholder="Prezzo"
              isRequired={true}
              errors={getFormErrors(errors, "price")}
              onChange={handlePriceChange}
            />
            <Box mb={4}>
              <Checkbox
                isChecked={includeCommission}
                onChange={handleIncludeFeeChange}
                name="includeCommission"
                value="yes"
              >
                <Text as="span">Commissioni a carico del cliente</Text>
              </Checkbox>
              {includeCommission && (
                <Text mt={2}>Prezzo finale: <b>€{finalPrice.toFixed(2)}</b></Text>
              )}
            </Box>

            {/* Product Description Field (using TextArea) */}
            <TextArea
              id="product-description"
              label="Descrizione"
              name="description"
              placeholder="Descrizione del prodotto"
              isRequired={true}
              errors={getFormErrors(errors, "description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </GridItem>
          <GridItem>
            <ImageInput
              name="image"
              label="Immagine Prodotto"
              id="product-image"
              defaultImage={storeImage ?? undefined}
            />
            <Text fontSize="xs" mt={2}>
              Puoi sostituire l&apos;immagine di default con una personalizzata
            </Text>
          </GridItem>
        </SimpleGrid>
        <SubmitButton>Salva Prodotto</SubmitButton>
      </form>
    </Box>
  );
}
