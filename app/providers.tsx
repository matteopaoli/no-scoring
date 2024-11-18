"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import theme from "@/app/theme/theme";
import { AppProgressBar } from "next-nprogress-bar";
import { globalStyles } from "./theme/styles";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {" "}
      <AppProgressBar
        height="4px"
        color={globalStyles.colors.brand[600]}
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </ChakraProvider>
  );
}
