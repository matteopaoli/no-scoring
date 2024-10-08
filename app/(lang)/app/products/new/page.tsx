"use client";

import {
  Box,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";

import createProduct from "../createProduct.action";
import { useFormState } from "react-dom";
import InputField from "@/app/components/fields/InputField"; // Import the InputField component
import TextArea from "@/app/components/fields/TextArea"; // Import the TextArea component
import ImageInput from "@/app/components/fields/ImageInput";
import getFormErrors from "@/app/utils/getFormErrors";

export default function CreateOrEditProductPage() {
  const [errors, action] = useFormState(createProduct, []);

  // Chakra color mode
  return (
    <Box width={{ base: "100%" }} pl={{ md: "24px" }}>
      <form action={action} style={{ width: "100%" }}>
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

            {/* Price Field */}
            <InputField
              id="product-price"
              label="Prezzo"
              name="price"
              placeholder="Prezzo"
              type="number"
              isRequired={true}
              step=".01"
              errors={getFormErrors(errors, 'price')}
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
          </GridItem>
          {/* Product Name Field */}
          <GridItem>
            <ImageInput
              name="image"
              label="Immagine Prodotto"
              id="product-image"
            />
          </GridItem>
        </Grid>
        <Button
          type="submit"
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w={{ base: '100%', md: '300px' }}
          h="50"
          mt="24px"
        >
          Salva prodotto
        </Button>
      </form>
    </Box>
  );
}
