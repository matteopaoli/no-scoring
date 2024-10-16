import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";

interface ProfileImageInputProps {
  name: string; // Name attribute for FormData compatibility
  label: string;
  id: string;
  fullName: string;
  image: string;
}

const ProfileImageInput: React.FC<ProfileImageInputProps> = ({
  name,
  label,
  id,
  fullName,
  image,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          src={imageUrl || image || undefined}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          mt={4}
          name={name}
          hidden
        />
        <Button
          mt={4}
          colorScheme="brand"
          onClick={() => document.getElementsByName(name)[0]?.click()} // Trigger input click
          leftIcon={<MdOutlineFileUpload />}
          variant="outline"
        >
          Carica
        </Button>
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
      </VStack>
    </FormControl>
  );
};

export default ProfileImageInput;
