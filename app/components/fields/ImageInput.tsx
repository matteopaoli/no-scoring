import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineDelete, MdOutlineFileUpload } from "react-icons/md";

interface ImageInputProps {
  name: string;
  label: string;
  id: string;
  image?: string;
  defaultImage?: string
}

const ImageInput: React.FC<ImageInputProps> = ({ name, label, id, image, defaultImage = "/img/product-placeholder.png" }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(image);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    const selectedFile = event.target.files?.[0];
  
    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert("Only JPEG and PNG images are allowed.");
        return;
      }
  
      const newImageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(newImageUrl);
    }
  };

  const handleRemoveImage = () => {
    setHasInteracted(true);
    setImageUrl(undefined);
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <FormControl>
      <FormLabel
        display="flex"
        ms="10px"
        htmlFor={id}
        fontSize="sm"
        color={textColorPrimary}
        fontWeight="bold"
        _hover={{ cursor: "pointer" }}
      >
        {label}
      </FormLabel>
      <Image
        src={imageUrl}
        alt="Uploaded"
        boxSize="200px"
        objectFit="contain"
        fallbackSrc={defaultImage}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        mt={4}
        name={hasInteracted ? name : undefined}
        hidden
        ref={inputRef}
      />
      <Flex gap={1} alignItems="center">
        <Button
          mt={4}
          colorScheme="brand"
          onClick={() => inputRef?.current?.click()}
          leftIcon={<MdOutlineFileUpload />}
          variant="outline"
        >
          Carica
        </Button>
        {imageUrl && (
          <IconButton
            aria-label="remove"
            size="lg"
            mt={4}
            colorScheme="red"
            onClick={handleRemoveImage}
            variant="ghost"
            icon={<MdOutlineDelete />}
          />
        )}
      </Flex>
    </FormControl>
  );
};

export default ImageInput;
