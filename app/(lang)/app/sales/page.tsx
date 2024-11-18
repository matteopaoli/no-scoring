import Stripe from "stripe";
import SalesTable from "./SalesTable";
import Statistics from "./Statistics";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function SalesPage() {
  const user = await getUserFromAuth();
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: user.stripeUserId });
  const { data: charges } = await stripe.charges.list({ limit: 1000 });
  const totalSales = charges.length;
  const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0) / 100;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000;
  const recentCharges = charges.filter((charge) => charge.created >= startOfMonth);
  const recentSales = recentCharges.length;
  const recentAmount = recentCharges.reduce((sum, charge) => sum + charge.amount, 0) / 100;
  

  const chargesWithDetails = await Promise.all(
    charges.map(async (charge) => {
      let productNames = [];
      if (charge.payment_intent) {
        const session = await stripe.checkout.sessions.list({
          payment_intent: charge.payment_intent,
          expand: ['data.line_items'],
        });
        if (session.data.length > 0) {
          productNames = session.data[0].line_items?.data.map(
            (item) => item.description || "Unknown Product"
          );
        }
      }

      return {
        ...charge,
        productNames,
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
