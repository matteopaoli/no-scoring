import {
  Box,
  GridItem,
  Heading,
  Link,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import GenericProductCard from "./GenericProductCard";
import IntroCarousel from "./IntroCarousel";

export default async function ProtectedPage() {
  return (
    <Box p={4}>
        <IntroCarousel />
        <GenericProductCard />
    </Box>
  );
}
