import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

interface ImageInputProps {
  name: string; // Name attribute for FormData compatibility
  label: string;
  id: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ name, label, id }) => {
  const DEFAULT_IMAGE_URL = "/img/product-placeholder.png";
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [file, setFile] = useState<File | null>(null);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const newImageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(newImageUrl);
      setFile(selectedFile);
    }
  };

  return (
    <FormControl textAlign="center">
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: "pointer" }}
      >{label}</FormLabel>
      <Image
        margin="0 auto"
        src={imageUrl}
        alt="Uploaded"
        boxSize="200px"
        objectFit="contain"
        fallbackSrc={DEFAULT_IMAGE_URL} // Fallback to default image
      />
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        mt={4}
        name={name} // Bind the name attribute
        hidden // Hide the input field
      />
      <Button
        mt={4}
        colorScheme="blue"
        onClick={() => document.getElementsByName(name)[0]?.click()} // Trigger input click
      >
        Aggiungi Immagine
      </Button>
    </FormControl>
  );
};

export default ImageInput;
