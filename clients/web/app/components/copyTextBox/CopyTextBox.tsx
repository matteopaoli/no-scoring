'use client'

import React from "react";
import {
  Box,
  Button,
  useClipboard,
  Tooltip,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

interface CopyTextBoxProps {
  children: string; // Accepts children as a string
}

const CopyTextBox: React.FC<CopyTextBoxProps> = ({ children }) => {
  const { hasCopied, onCopy } = useClipboard(children);

  // Define color modes
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const bgBox = useColorModeValue("white", "whiteAlpha.100");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgButtonHover = useColorModeValue("secondaryGray.400", "whiteAlpha.50");

  return (
    <Tooltip
      label={hasCopied ? "Copiato!" : "Clicca per copiare"}
      aria-label="A tooltip"
    >
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        padding="4"
        backgroundColor={bgBox}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={onCopy}
        _hover={{ bg: bgButtonHover }}
      >
        <Text style={{ color: textColor }} fontSize={{ sm: "sm", md: 'md' }}>{children}</Text>
        <Button
          size="sm"
          onClick={onCopy}
          backgroundColor={bgButton}
          _hover={{ bg: bgButtonHover }} // Change background on button hover
          data-testid="copy-payment-link-button"
        >
          Copia
        </Button>
      </Box>
    </Tooltip>
  );
};

export default CopyTextBox;
