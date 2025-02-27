// src/components/SearchResult.tsx
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';

// Define the props type
interface SearchResultProps {
  result: {
    heading: string;
    subheading: string;
    url: string;
  }
}

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  return (
    <Box py={1} mb={2}>
      <Link href={result.url}>
        <Text fontWeight="bold" fontSize="lg">
          {result.heading}
        </Text>
      </Link>
      <Text color="gray.600">{result.subheading}</Text>
    </Box>
  );
};

export default SearchResult;
