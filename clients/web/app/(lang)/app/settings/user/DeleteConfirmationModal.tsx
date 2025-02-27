import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import signOutAction from "@/app/signout.action";

export default function DeleteConfirmationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveAccount = async () => {
    setIsLoading(true);
    await fetch('/api/account/remove', { method: 'POST' })
    signOutAction('/login?success=true&action=removeAccount')
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Conferma Rimozione Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Sei sicuro di voler rimuovere il tuo account? Questa azione è
          irreversibile.
        </ModalBody>
        <Button colorScheme="red" onClick={handleRemoveAccount} mx={20} my={10}>
          {isLoading ? <Spinner size="sm" /> : 'Rimuovi Account'}
        </Button>
      </ModalContent>
    </Modal>
  );
}
