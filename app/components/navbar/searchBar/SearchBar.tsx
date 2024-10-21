import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  InputGroupProps,
  Box,
  List,
  ListItem,
  Spinner,
  Text,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import SearchResult from "./SearchResult";

// Define the props type
interface SearchBarProps extends InputGroupProps {
  apiPath: string; // Add apiPath prop
  variant?: string;
  background?: string;
  placeholder?: string;
  borderRadius?: string;
  debounceDelay?: number; // Optional prop for debounce delay
}

export function SearchBar({
  apiPath,
  variant,
  background,
  placeholder,
  borderRadius,
  debounceDelay = 300, // Default debounce delay set to 300ms
  ...rest
}: SearchBarProps) {
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<Record<string, any[]> | null>(null); // State to hold search results
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Function to handle search logic
  const handleSearch = async (query: string) => {
    if (!query) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiPath}?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data); // Set the fetched results to state
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchQuery);
    }, debounceDelay);

    // Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debounceDelay]);

  return (
    <Box position="relative" w={{ base: "100%", md: "200px" }} {...rest}>
      <InputGroup>
        <InputLeftElement>
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            _hover={{ bg: "none" }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{ boxShadow: "none" }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            aria-label="Search"
          />
        </InputLeftElement>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant={variant || "search"}
          fontSize="sm"
          bg={background || inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius || "30px"}
          placeholder={placeholder || "Search..."}
        />
      </InputGroup>

      {/* Results List */}
      {loading && <Spinner size="sm" position="absolute" top="100%" left="50%" transform="translateX(-50%)" />}
      {results !== null && (
        <List p="20px" position="relative" right="0" spacing={2} mt={2} bg="white" borderRadius="md" boxShadow="md" maxHeight="600px" overflowY="auto" zIndex="10" w={{ base: '100%', md: '600px' }}>
          { results?.partners.length && (
            <>
              <Text fontWeight="bold">Partner</Text>
              <Divider />
              {results.partners.map((result, index) => (
              <ListItem key={index} p={1} borderBottom="1px" borderColor="gray.200" _hover={{ bg: "gray.100", cursor: "pointer" }}>
                <SearchResult result={result} />
              </ListItem>
            ))}
            </>
          )}
          {!Object.values(results).some(x => x.length > 0) && <Text>Nessun risultato</Text>}
        </List>
      )}
    </Box>
  );
}
