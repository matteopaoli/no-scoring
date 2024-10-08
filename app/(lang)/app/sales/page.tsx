import { getUser } from "@/app/db";
import { auth } from "app/auth";
import Stripe from "stripe";
import SalesTable from "./SalesTable";
import Statistics from "./Statistics";

export default async function SalesPage() {
  let session = await auth();
  const user = await getUser(session?.user?.email!);

  const stripe = new Stripe(user.stripeSecretKey);

  // Fetch the charges data
  const { data: charges } = await stripe.charges.list({ limit: 1000 });

  // Calculate total sales and total amount
  const totalSales = charges.length;
  const totalAmount =
    charges.reduce((sum, charge) => sum + charge.amount, 0) / 100; // Convert to proper amount format (divide by 100 for cents)

  // Filter charges for the last 30 days
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
  const recentCharges = charges.filter(
    (charge) => charge.created >= thirtyDaysAgo
  );
  const recentSales = recentCharges.length;
  const recentAmount =
    recentCharges.reduce((sum, charge) => sum + charge.amount, 0) / 100;

  // Fetch customer details (name, email) and product names for each charge
  const chargesWithDetails = await Promise.all(
    charges.map(async (charge) => {
      let productNames = [];

      // Check if the charge has an associated PaymentIntent
      if (charge.payment_intent) {
        const session = await stripe.checkout.sessions.list({
          payment_intent: charge.payment_intent,
          expand: ['data.line_items'],
        });

        // Extract product names from line items
        if (session.data.length > 0) {
          productNames = session.data[0].line_items?.data.map(
            (item) => item.description || "Unknown Product"
          );
        }
      }

      return {
        ...charge,
        productNames, // Add the list of product names to the charge
      };
    })
  );

  return (
    <>
      <Statistics data={{ recentSales, recentAmount, totalSales, totalAmount }} />
      <SalesTable chargesData={chargesWithDetails} />
    </>
  );
}
