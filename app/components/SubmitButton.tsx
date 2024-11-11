"use client";

import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  onClick,
  w,
  loadingText,
  ...rest
}: {
  children: string;
  onClick?: () => any;
  w?: ButtonProps["w"];
  loadingText?: ButtonProps["loadingText"];
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      fontSize="sm"
      variant="solid"
      colorScheme="brand"
      fontWeight="500"
      w={w ?? { base: "100%", md: "300px" }}
      h="50"
      mt="24px"
      disabled={pending}
      onClick={onClick}
      isLoading={pending}
      loadingText={loadingText}
      {...rest}
    >
      {pending ? <Spinner size="sm" /> : children}
    </Button>
  );
}
