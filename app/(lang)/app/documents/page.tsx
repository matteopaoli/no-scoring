import { Box, SimpleGrid } from "@chakra-ui/react";
import DocumentCard from "./DocumentCard";

const documents = [
  {
    title: 'Brochure PayTomorrow',
    url: '/docs/Brochure Paytomorrow.pdf',
  },
  {
    title: 'Contratto di Licenza con l\'Utente Finale',
    url: '/docs/contratto Paytomorrow.pdf',
  },
  {
    title: 'Presentazione PayTomorrow',
    url: '/docs/Presentazione paytomorrow ( lavora con noi ).pdf',
  },
  {
    title: 'Vetrofania',
    url: '/docs/Vetrofania.pdf',
  },
];

export default function DocumentsPage() {
  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, md: 8 }} spacing={10}>
        {documents.map((doc, index) => (
          <DocumentCard key={index} document={doc} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
