// src/DocumentCard.tsx
"use client";
import React from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import {
  AiFillFilePdf,
  AiOutlineDownload,
  AiOutlineFileImage,
} from "react-icons/ai";

interface Document {
  title: string;
  url: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  
  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.title;
    link.target = "_blank";
    window.document.body.appendChild(link);
    link.click();
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
        {document.url.endsWith(".pdf") ? (
          <AiFillFilePdf size="50px" color="#E53E3E" />
        ) : (
          <AiOutlineFileImage size="50px" color="#E53E3E" />
        )}
      </Box>
      <Text fontWeight="bold" mt={2}>
        {document.title}
      </Text>
    </Box>
  );
};

export default DocumentCard;
