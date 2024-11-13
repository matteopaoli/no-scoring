"use client";

import { CopyIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { MdContentCopy, MdLink } from "react-icons/md";

export default function CopyButton({ text }: { text: string }) {
  const toast = useToast();
  return (
    <IconButton
      aria-label="Copy"
      icon={<MdLink />}
      size="md"
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
      Copy
    </IconButton>
  );
}
