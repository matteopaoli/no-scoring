"use client";

import { Box, Spinner, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import SubmitButton from "@/app/components/SubmitButton";
import { useFormState } from "react-dom";
import updateStoreAction from "./updateStore.action";

type Suggestion = {
  description: string;
  place_id: string;
};

type PlaceDetails = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
};

export default function StoreForm({ existingStore }: { existingStore: any }) {
  console.log("Existing store:", existingStore);
  const [addressInput, setAddressInput] = useState(
    existingStore?.address || ""
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, action] = useFormState(updateStoreAction, []);

  const fetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/autocomplete?input=${input}`
        );
        const data = await res.json();
        setSuggestions(data.predictions);
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const onSubmit = async (formData: FormData) => {
    if (!selectedPlace) {
      return;
    }
    formData.append("storeId", existingStore.id);
    formData.append("lat", String(selectedPlace?.geometry.location.lat));
    formData.append("lng", String(selectedPlace?.geometry.location.lng));
    formData.append("placeId", selectedPlace?.place_id || "");
    action(formData);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInput(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = async (suggestion: Suggestion) => {
    console.log("Selected suggestion:", suggestion);
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/maps/place-details?placeId=${suggestion.place_id}`
      );
      const place = await res.json();
      setSelectedPlace({
        place_id: suggestion.place_id,
        formatted_address: place.result.formatted_address,
        geometry: place.result.geometry,
      });
      setAddressInput(place.result.formatted_address);
      setShowSuggestions(false);
    } catch (err) {
      console.error("Place details error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={onSubmit}>
      <Box position="relative" mb={4}>
        <label
          htmlFor="shop-address"
          style={{
            display: "flex",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: useColorModeValue("navy.700", "white"),
          }}
        >
          Indirizzo
          <Text color={useColorModeValue("brand.500", "brand.400")}>*</Text>
        </label>
        <input
          id="shop-address"
          name="address"
          placeholder="Inserisci l'indirizzo"
          value={addressInput}
          onChange={handleAddressChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{
            width: "100%",
            height: "45px",
            border: "1px solid #e0e0e0",
            borderRadius: "16px",
            padding: "0 18px",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "transparent",
          }}
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
                onMouseDown={(e) => e.preventDefault()}
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
            right={4}
            top="50%"
            transform="translateY(-50%)"
          >
            <Spinner size="sm" />
          </Box>
        )}

        <Flex justifyContent="flex-end" mt={4}>
          <SubmitButton>Salva</SubmitButton>
        </Flex>
      </Box>
    </form>
  );
}
