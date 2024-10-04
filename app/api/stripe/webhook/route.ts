import { getUserByStripeAccountId, getWebhookSecret } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const searchParams = request.nextUrl.searchParams;
  const merchantAccountId = searchParams.get('merchantId');
  
  if (!merchantAccountId) {
    throw new Error('No merchant account param');
  }

  const merchant = await getUserByStripeAccountId(merchantAccountId);
  if (!merchant) {
    throw new Error('Merchant not found');
  }

  const stripe = new Stripe(merchant.stripeSecretKey);
  const webhook = await getWebhookSecret(merchantAccountId);
  // webhook.secret = 'whsec_88ee09d943ae2353bfa77ed1ca6242975826e5303ddfaeaa1fa854d1123c6cd1'
  console.log(webhook)
  
  if (!webhook) {
    throw new Error('No secret in db');
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    if (!sig) {
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhook.secret);
    console.log(event);

    // Check if the event type is checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve the amount of the purchase
      const amount = session.amount_total; // Amount is in cents
      console.log(`Amount: ${amount}`);

      // Calculate 1.5% of the amount
      const transferAmount = Math.round(amount * 0.015); // Convert to the smallest currency unit

      // Create a transfer to the connected account
      const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: session.currency, // Use the same currency as the session
        destination: merchant.stripeLegAccountId, // Connected account ID
        description: `Transfer for session ${session.id}`, // Optional description
      });

      console.log(`Transfer successful: ${transfer.id}`);
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error('⚠️  Webhook Error:', err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
