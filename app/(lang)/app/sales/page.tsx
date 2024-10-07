import { getUser } from '@/app/db';
import { auth } from 'app/auth';
import Stripe from 'stripe';
import SalesTable from './SalesTable';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

export default async function SalesPage() {
  let session = await auth();
  const user = await getUser(session?.user?.email!);

  const stripe = new Stripe(user.stripeSecretKey);
  const { data } = await stripe.charges.list({ limit: 1000 });
  const charges = data;

  // Calculate total sales and total amount
  const totalSales = charges.length;
  const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0) / 100; // Convert to proper amount format (divide by 100 for cents)

  // Filter charges for the last 30 days
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
  const recentCharges = charges.filter(charge => charge.created >= thirtyDaysAgo);
  const recentSales = recentCharges.length;
  const recentAmount = recentCharges.reduce((sum, charge) => sum + charge.amount, 0) / 100;

  return (
    <>
      <Box mb="8" mx="10">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="6">
          <Stat>
            <StatLabel>Numero totale di vendite</StatLabel>
            <StatNumber>{totalSales}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Importo totale</StatLabel>
            <StatNumber>€{totalAmount.toFixed(2)}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Vendite (ultimi 30 giorni)</StatLabel>
            <StatNumber>{recentSales}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Importo (ultimi 30 giorni)</StatLabel>
            <StatNumber>€{recentAmount.toFixed(2)}</StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>

      <SalesTable chargesData={charges} />
    </>
  );
}
