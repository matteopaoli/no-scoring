"use client";

import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverFooter,
  Button,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useFormState } from "react-dom";
import deletePosAction from "./deletePos.action";
import { useRouter } from 'next/navigation';

export default function DeletePOSButton({ posId }: { posId: string }) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [formState, deletePos] = useFormState(deletePosAction, {});
  const router = useRouter();

  const togglePopover = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const handleDelete = async () => {
    try {
      await deletePos(posId)
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setPopoverOpen(false);
      router.refresh();
    }
  };

  return (
    <Tooltip label="Elimina lead">
      <React.Fragment>
        <Popover isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)}>
          <PopoverTrigger>
            <IconButton
              icon={<MdDelete />}
              aria-label="Elimina"
              ms="20px"
              colorScheme="red"
              variant="outline"
              size="md"
              onClick={togglePopover}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              Questa azione eliminerà permanentemente il lead.
            </PopoverBody>
            <PopoverFooter display="flex" justifyContent="flex-end">
              <Button
                variant="outline"
                mr={3}
                onClick={() => setPopoverOpen(false)}
              >
                Annulla
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Conferma
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </React.Fragment>
    </Tooltip>
  );
}
