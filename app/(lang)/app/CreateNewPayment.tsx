"use client";

import PaymentModal from "@/app/components/forms/createNewPaymentForm";
import PartnerCreateMerchantForm from "@/app/components/forms/PartnerCreateMerchantForm";
import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

export default function createNewPayment() {
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
        Nuovo pagamento istantaneo
      </Button>
      <PaymentModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
