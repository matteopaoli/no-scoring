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
import IntroCarousel from "./IntroCarousel";
import DownloadSigns from "./DownloadSigns";
import CreateNewPayment from "./CreateNewPayment";

export default async function ProtectedPage() {
  return (
    <Box p={4}>
        <IntroCarousel />
        <CreateNewPayment />
        <DownloadSigns />
    </Box>
  );
}
