import { Box, Flex } from "@chakra-ui/react";
import DocumentCard from "./DocumentCard";

const documents = [
  {
    title: 'Brochure PayTomorrow',
    url: '/docs/Brochure Paytomorrow.pdf',
  },
  {
    title: 'Presentazione PayTomorrow',
    url: '/docs/Presentazione paytomorrow ( lavora con noi ).pdf',
  },
  {
    title: 'Vetrofania',
    url: '/docs/Vetrofania.png',
  },
];

export default function DocumentsPage() {
  return (
    <Box p={5} mt="50px">
      <Flex maxW="1000px" gap="10px" flexWrap="wrap">
        {documents.map((doc, index) => (
          <DocumentCard key={index} document={doc} />
        ))}
      </Flex>
    </Box>
  );
}
