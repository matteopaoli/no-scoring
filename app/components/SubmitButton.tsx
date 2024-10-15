"use client";

import { Button, Spinner } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      fontSize="sm"
      variant="solid"
      colorScheme="brand"
      fontWeight="500"
      w={{ base: "100%", md: "300px" }}
      h="50"
      mt="24px"
      disabled={pending}
    >
      {pending ? <Spinner size="sm" /> : children}
    </Button>
  );
}
