import ImageInput from "@/app/components/fields/ImageInput";
import InputField from "@/app/components/fields/InputField";
import SubmitButton from "@/app/components/SubmitButton";
import getFormErrors from "@/app/utils/getFormErrors";
import { Box, Grid, GridItem, VStack } from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { updateStoreAction } from "./updateStore.action";

interface Store {
  id: string;
  name: string;
  image: string;
}

export default function UpdateStoreForm({ store }: { store: Store }) {
  const [errors, action] = useFormState(updateStoreAction, []);
  return (
    <form action={action} style={{ width: "100%" }}>
      <Grid templateColumns="1fr" gap={6}>
        <GridItem>
          <Box width={{ base: "100%", md: "500px" }}>
            <InputField
              id="storeName"
              name="storeName"
              label="Nome Negozio"
              placeholder="Inserisci il nome del negozio"
              type="text"
              errors={getFormErrors(errors, "storeName")}
              defaultValue={store.name}
            />
            <ImageInput
              name="storeLogo"
              label="Immagine Negozio"
              id="store-logo"
              image={store.image}
            />
          </Box>
        </GridItem>
      </Grid>
      <VStack alignItems="flex-start">
        <SubmitButton>Aggiorna Negozio</SubmitButton>
      </VStack>
    </form>
  );
}
