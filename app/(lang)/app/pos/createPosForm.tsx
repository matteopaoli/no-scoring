import InputField from "@/app/components/fields/InputField";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import createPosAction from "./createPos.action";
import getFormErrors from "@/app/utils/getFormErrors";
import { Box, Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal, Text } from "@chakra-ui/react";
import CopyButton from "@/app/components/CopyButton";
import SubmitButton from "@/app/components/SubmitButton";
import { MdAddCircleOutline } from "react-icons/md";

export default function CreatePosForm() {
  const [createPosState, createPos] = useFormState(createPosAction, {});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createPosNameInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (createPosState?.data) {
      setIsSubmitted(true);
    }
  }, [createPosState]);

  const reset = () => {
    setIsSubmitted(false);
    formRef?.current?.reset();
    createPosNameInputRef.current?.focus();
  };

  return (
    <Popover initialFocusRef={createPosNameInputRef} matchWidth>
      <PopoverTrigger>
        <Box p={4}>
          <Button
            leftIcon={<MdAddCircleOutline />}
            variant="solid"
            colorScheme="brand"
            maxW={300}
          >
            Aggiungi nuovo POS
          </Button>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton mt="5px" />
          <PopoverHeader>
            <Text p={2} fontWeight="bold">
              Crea un nuovo Pos
            </Text>
          </PopoverHeader>

          <PopoverBody mt="20px">
            <Text mb="20px" fontSize="sm">
              Inserisci le informazioni richieste per aggiugnere un nuovo POS.
              <br />
              <br /> Una volta creato, invieremo un'email all'indirizzo inserito
              con le istruzioni per accedere a PayTomorrow in modalità POS
            </Text>
            <form action={createPos}>
              <InputField
                id="email"
                name="posName"
                label="Nome"
                placeholder=""
                type="text"
                errors={getFormErrors(createPosState.errors, "posName")}
                ref={createPosNameInputRef}
                isRequired
              />
              <InputField
                id="email"
                name="email"
                label="Email"
                placeholder=""
                type="text"
                errors={getFormErrors(createPosState.errors, "email")}
                isRequired
              />
              {createPosState.data && isSubmitted ? (
                <Box
                  textAlign="center"
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="green.600"
                    mb={4}
                  >
                    Il POS è stato creato correttamente!
                  </Text>
                  <Text mb={4}>
                    Il seguente link è valido una sola volta entro 24 ore.
                    Visitandolo, verrai automaticamente autenticato come il
                    profilo POS appena generato, e il link verrà invalidato.
                  </Text>
                  <Flex mb={4} direction="column" gap={4}>
                    <CopyButton text={createPosState.data} variant="solid" />
                    <Button variant="outline" onClick={reset}>
                      Genera nuovo
                    </Button>
                  </Flex>
                  {/* <Box>
                    <InputField
                      id="email-recipient"
                      name="emailRecipient"
                      placeholder="Indirizzo email"
                      errors={sendPosLinkEmailState.errors}
                      label="Email destinatario"
                    />
                    <Button
                      colorScheme="brand"
                      leftIcon={<MdEmail />}
                      variant="outline"
                      size="sm"
                      mt={2}
                      // onClick={() => sendEmail(createPosState.data, email)}
                      // isDisabled={!email || !validateEmail(email)}
                    >
                      Invia email
                    </Button>
                  </Box> */}
                </Box>
              ) : (
                <SubmitButton>Crea POS</SubmitButton>
              )}
            </form>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
