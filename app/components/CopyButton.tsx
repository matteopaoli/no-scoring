"use client";

import { CopyIcon } from "@chakra-ui/icons";
import { Button, IconButton, useToast } from "@chakra-ui/react";
import { MdContentCopy, MdLink } from "react-icons/md";

export default function CopyButton({ text }: { text: string }) {
  const toast = useToast();
  return (
    <Button
      aria-label="Copy"
      leftIcon={<MdLink />}
      size="md"
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast({
          title: "Copiato!",
          status: "info",
          duration: 2000,
          isClosable: false,
        });
      }}
    >
      Link
    </Button>
  );
}
