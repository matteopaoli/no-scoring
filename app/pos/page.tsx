import { redirect } from "next/navigation";
import getUserFromAuth from "../utils/getUserFromAuth";
import {
  Box,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NewPaymentForm from "./NewPaymentForm";
import Footer from "../components/footer/FooterAdmin";

export default async function PosPage() {
  const user = await getUserFromAuth();

  return (
    <Flex flexDirection="column" minHeight="100vh" backgroundColor="#f4f4f4">
      <Box padding={4}>
        <Box textAlign="center" marginBottom={8}>
          <Text fontSize="4xl" fontWeight="bold">
            Paytomorrow - Sistema POS
          </Text>
        </Box>

        {/* <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="lg"
            textAlign="center"
          >
            <Stat>
              <StatLabel>Vendite Totali</StatLabel>
              <StatNumber>€1278</StatNumber>
            </Stat>
          </Box>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="lg"
            textAlign="center"
          >
            <Stat>
              <StatLabel>Vendite</StatLabel>
              <StatNumber>23</StatNumber>
            </Stat>
          </Box>
        </Grid> */}

        <Box
          m="50px auto"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="lg"
        >
          <Heading size="md" mb="4">
            Nuovo pagamento
          </Heading>
          <NewPaymentForm />
        </Box>

        {/* Sales Table */}
        {/* <Box mt={8} bg="white" p={6} borderRadius="md" boxShadow="lg">
          <Text fontSize="2xl" mb={4}>
            Vendite
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Articolo</Th>
                <Th>Quantità</Th>
                <Th>Totale</Th>
              </Tr>
            </Thead>
            <Tbody>
                {salesData.map((sale) => (
                <Tr key={sale.id}>
                    <Td>{sale.item}</Td>
                    <Td>{sale.quantity}</Td>
                    <Td>€{sale.total}</Td>
                </Tr>
                ))}
            </Tbody>
          </Table>
        </Box> */}
      </Box>
      <Box mt="auto">
        <Footer />
      </Box>
    </Flex>
  );
}
