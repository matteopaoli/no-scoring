import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import deleteLeadAction from "./deleteLead.action";
import { useRouter } from "next/navigation";

export default function DeleteLeadButton({ userId }: { userId: string }) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const togglePopover = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const handleDelete = async () => {
    await deleteLeadAction(userId);
    setPopoverOpen(false);
    router.refresh();
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
