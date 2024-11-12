"use client";

import PartnerCreateMerchantForm from "@/app/components/forms/PartnerCreateMerchantForm";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { ReactNode } from "react";
import { MdAdd, MdPlusOne } from "react-icons/md";

export default function CreateMerchant({ businessTypesOptions }: { businessTypesOptions: ReactNode[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex justifyContent="end">
      <Button
        onClick={onOpen}
        my={10}
        maxWidth={300}
        colorScheme="brand"
        leftIcon={<MdAdd />}
      >
        Aggiungi un nuovo utente
      </Button>
      <PartnerCreateMerchantForm isOpen={isOpen} onClose={onClose} businessTypesOptions={businessTypesOptions} />
    </Flex>
  );
}
