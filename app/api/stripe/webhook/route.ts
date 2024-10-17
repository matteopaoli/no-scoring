import { FIRST_LEVEL_PARTNER_COMMISSION_RATE, LEG_COMMISSION_RATE, SECOND_LEVEL_PARTNER_COMMISSION_RATE, VAT } from "@/app/constants";
import { createSale, getStoreByUserId, getUserByStripeAccountId, getWebhookSecret } from "@/app/db";
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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const amount = session.amount_total as number; // Amount is in cents

      const transferAmount = Math.round(amount * LEG_COMMISSION_RATE * VAT);

      const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent as string)

      await stripe.transfers.create({
        amount: transferAmount,
        currency: session.currency,
        destination: merchant.stripeLegAccountId,
        description: `Transfer for session ${session.id}`,
        source_transaction: paymentIntent.latest_charge as string
      });

      const store = await getStoreByUserId(merchant.id)

      await createSale({
        stripePaymentIntentId: paymentIntent.id,
        amount: `${amount / 100}`,
        storeId: store.id,
        legCommission: `${transferAmount / 100}`,
        firstLevelPartnerCommission: `${Math.round(amount * FIRST_LEVEL_PARTNER_COMMISSION_RATE * VAT) / 100}`,
        secondLevelPartnerCommission: `${Math.round(amount * SECOND_LEVEL_PARTNER_COMMISSION_RATE * VAT) / 100}`,
      })
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error('⚠️  Webhook Error:', err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
