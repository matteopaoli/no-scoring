"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Spinner,
  Text,
  useColorModeValue,
  Flex,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

interface Suggestion {
  description: string;
  place_id: string;
}

interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

interface AddressInputFieldProps {
  label: string;
  errors: string[];
  namePrefix?: string;
  existingAddress?: string;
}

const AddressInputField: React.FC<AddressInputFieldProps> = ({
  label,
  errors,
  namePrefix = "",
  existingAddress = "",
}) => {
  const [addressInput, setAddressInput] = useState<string>(existingAddress);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const textColor = useColorModeValue("navy.700", "white");

  const fetchSuggestions = useCallback((input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/autocomplete?input=${input}`
    )
      .then((res) => res.json())
      .then((data) => setSuggestions(data.predictions))
      .catch((err) => console.error("Autocomplete error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);

    setDebounceTimer(timer);
  };

  const handleSelectSuggestion = async (suggestion: Suggestion) => {
    setIsLoading(true);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/place-details?placeId=${suggestion.place_id}`
    )
      .then((res) => res.json())
      .then((place) => {
        setSelectedPlace({
          place_id: suggestion.place_id,
          formatted_address: place.result.formatted_address,
          geometry: place.result.geometry,
        });
        setAddressInput(place.result.formatted_address);
        setShowSuggestions(false);
      })
      .catch((err) => console.error("Place details error:", err))
      .finally(() => setIsLoading(false));
  };

  return (
    <FormControl isInvalid={errors.length > 0} mb="30px" isRequired={true}>
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="700"
        color={textColor}
        mb="8px"
      >
        {label}
      </FormLabel>

      <Input
        id="shop-address"
        name="address"
        placeholder="Inserisci l'indirizzo"
        value={addressInput}
        onChange={handleAddressChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        ref={inputRef}
        variant="main"
        h="44px"
        maxH="44px"
        fontWeight="500"
        _placeholder={{ fontWeight: "400", color: "secondaryGray.600" }}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          width="100%"
          maxHeight="300px"
          overflowY="auto"
          bg="white"
          boxShadow="md"
          borderRadius="md"
          zIndex="dropdown"
          border="1px solid"
          borderColor="gray.200"
          mt={1}
        >
          {suggestions.map((s) => (
            <Box
              key={s.place_id}
              p={2}
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.description}
            </Box>
          ))}
        </Box>
      )}

      {isLoading && (
        <Box
          position="absolute"
          right={1}
          top="75%"
          transform="translateY(-50%)"
        >
          <Spinner size="sm" />
        </Box>
      )}

      {/* Hidden fields for lat, lng, placeId */}
      <input
        type="hidden"
        name={`${namePrefix}lat`}
        value={selectedPlace?.geometry.location.lat || ""}
      />
      <input
        type="hidden"
        name={`${namePrefix}lng`}
        value={selectedPlace?.geometry.location.lng || ""}
      />
      <input
        type="hidden"
        name={`${namePrefix}placeId`}
        value={selectedPlace?.place_id || ""}
      />
      <input
        type="hidden"
        name={`${namePrefix}address`}
        value={selectedPlace?.formatted_address || ""}
      />
    </FormControl>
  );
};

export default AddressInputField;
