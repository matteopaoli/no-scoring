// src/DocumentCard.tsx
"use client";
import React from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { AiFillFilePdf, AiOutlineDownload } from "react-icons/ai";

interface Document {
  title: string;
  url: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const handleDownload = () => {
    // Create an anchor element
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.title; // Specify a default filename if possible
    link.target = "_blank";

    // Append to the body and trigger a click
    window.document.body.appendChild(link);
    link.click();

    // Remove the element after triggering the download
    window.document.body.removeChild(link);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="md"
      width="250px"
      position="relative"
    >
      <IconButton
        aria-label="Download"
        icon={<AiOutlineDownload />}
        position="absolute"
        top="8px"
        right="8px"
        onClick={handleDownload}
        size="lg"
        variant="ghost"
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        mt={2}
      >
        <AiFillFilePdf size="50px" color="#E53E3E" />
      </Box>
      <Text fontWeight="bold" mt={2}>
        {document.title}
      </Text>
    </Box>
  );
};

export default DocumentCard;
