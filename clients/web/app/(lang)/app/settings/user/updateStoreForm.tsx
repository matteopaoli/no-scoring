import ImageInput from "@/app/components/fields/ImageInput";
import InputField from "@/app/components/fields/InputField";
import SubmitButton from "@/app/components/SubmitButton";
import getFormErrors from "@/app/utils/getFormErrors";
import {
  Box,
  Grid,
  GridItem,
  Radio,
  VStack,
  Switch,
  FormControl,
  Text,
  FormLabel,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { updateStoreAction } from "./updateStore.action";
import AddressInputField from "@/app/components/fields/AddressInputField";
import { use, useState } from "react";
import { updateStoreFeesAction } from "./updateStoreFees.action";

interface Store {
  id: string;
  name: string;
  image: string;
  address: string;
  customerPaysFees: boolean;
}

export default function UpdateStoreForm({ store }: { store: Store }) {
  const [errors, action] = useFormState(updateStoreAction, []);
  const [storeFeeErrors, storeFeesAction] = useFormState(
    updateStoreFeesAction,
    {}
  );
  const toast = useToast();
  const [customerPaysFeesSwitchValue, setCustomerPaysFeesSwitchValue] =
    useState(store.customerPaysFees);

  const handleFeesSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setCustomerPaysFeesSwitchValue(isChecked);
    storeFeesAction(isChecked);
    toast({
      title: "Impostazioni aggiornate",
      description:
        "Le impostazioni delle commissioni sono state aggiornate con successo.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <GridItem>
          <form action={action} style={{ width: "100%" }}>
            <Box>
              <InputField
                id="storeName"
                name="storeName"
                label="Nome Negozio"
                placeholder="Inserisci il nome del negozio"
                type="text"
                errors={getFormErrors(errors, "storeName")}
                defaultValue={store.name}
              />
              <AddressInputField
                namePrefix="storeAddress_"
                existingAddress={store.address}
                errors={getFormErrors(errors, "storeAddress")}
                label="Indirizzo"
              />
              <ImageInput
                name="storeLogo"
                label="Immagine Negozio"
                id="store-logo"
                image={store.image}
              />
            </Box>
            <VStack alignItems="flex-start">
              <SubmitButton>Aggiorna Negozio</SubmitButton>
            </VStack>
          </form>
        </GridItem>
        <GridItem>
          <Box bg="#fff" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={1}>
              Commissioni di Servizio (PayTomorrow App)
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Le commissioni di servizio coprono i costi di pagamento e
              manutenzione della piattaforma.
            </Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Nota bene: questa impostazione si applica esclusivamente all&apos;app
              mobile PayTomorrow. Per i link di pagamento generati sul sito web,
              sia manualmente che tramite POS, verrà sempre richiesto di
              selezionare chi si farà carico delle commissioni di servizio.
            </Text>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Commissioni a carico del cliente</FormLabel>
              <Switch
                colorScheme="brand"
                id="customer-pays-fees"
                name="customerPaysFees"
                isChecked={customerPaysFeesSwitchValue}
                onChange={handleFeesSwitchChange}
              />
            </FormControl>
            {customerPaysFeesSwitchValue ? (
              <Text fontSize="sm" color="gray.500" mt={2}>
                Il cliente pagherà i costi di servizio
              </Text>
            ) : (
              <Text fontSize="sm" color="gray.500" mt={2}>
                Riceverai i pagamenti dedotti dei costi di servizio
              </Text>
            )}
          </Box>
        </GridItem>
      </Grid>
    </>
  );
}
