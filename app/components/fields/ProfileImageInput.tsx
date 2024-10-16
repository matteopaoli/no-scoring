import React, { useRef, useState } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  useColorModeValue,
  VStack,
  Text,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { MdOutlineDelete, MdOutlineFileUpload } from "react-icons/md";

interface ProfileImageInputProps {
  name: string; // Name attribute for FormData compatibility
  label: string;
  id: string;
  fullName: string;
  image?: string;
}

const ProfileImageInput: React.FC<ProfileImageInputProps> = ({
  name,
  label,
  id,
  fullName,
  image,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(image);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if the file size exceeds 5MB
      const maxSizeInMB = 5;
      if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
        setError(`L'immagine non puó superare i ${maxSizeInMB}MB.`);
        return;
      }

      setError(null); // Clear any previous errors
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
    <FormControl textAlign="center">
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
      <VStack width="fit-content" justifyContent="center">
        <Avatar
          _hover={{ cursor: "pointer" }}
          color="white"
          name={fullName}
          bg="#11047A"
          size="2xl"
          src={imageUrl || undefined}
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
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </FormControl>
  );
};

export default ProfileImageInput;
