import {
  FIRST_LEVEL_PARTNER_COMMISSION_RATE,
  LEG_COMMISSION_RATE,
  SECOND_LEVEL_PARTNER_COMMISSION_RATE,
  VAT,
} from "@/app/constants";
import {
  createSale,
  getStoreByUserId,
} from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");

  const stripe = new Stripe(process.env.STRIPE_API_KEY!);

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    if (!sig) {
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, 'whsec_caee39313a417c86dde41cbce7f535b85b99e85415d8e53655da677dce121fcb') as
      | Stripe.CheckoutSessionAsyncPaymentSucceededEvent
      | Stripe.CheckoutSessionCompletedEvent;

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const amount = session.amount_total as number;
      const transferAmount = Math.round(amount * LEG_COMMISSION_RATE * VAT);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        event.data.object.payment_intent as string
      );


      console.log(JSON.stringify(session, null, 2));

      const store = await getStoreByUserId(merchant.id);

      await createSale({
        stripePaymentIntentId: paymentIntent.id,
        amount: `${amount / 100}`,
        storeId: store.id,
        legCommission: `${transferAmount / 100}`,
        firstLevelPartnerCommission: `${
          Math.round(amount * FIRST_LEVEL_PARTNER_COMMISSION_RATE * VAT) / 100
        }`,
        secondLevelPartnerCommission: `${
          Math.round(amount * SECOND_LEVEL_PARTNER_COMMISSION_RATE * VAT) / 100
        }`,
      });
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("⚠️  Webhook Error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
