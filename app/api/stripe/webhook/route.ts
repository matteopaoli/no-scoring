import {
  FIRST_LEVEL_PARTNER_FEE_RATE,
  LEG_FEE_RATE,
  SECOND_LEVEL_PARTNER_FEE_RATE,
  VAT,
} from "@/app/constants";
import { createSale, getStoreByUserId } from "@/app/db";
import { MerchantService } from "@/app/services/merchantService";
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

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SIGNATURE!
    ) as
      | Stripe.CheckoutSessionAsyncPaymentSucceededEvent
      | Stripe.CheckoutSessionCompletedEvent
      | Stripe.AccountUpdatedEvent;

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const amount = session.amount_total as number;
      const transferAmount = Math.round(amount * LEG_FEE_RATE * VAT);
      const merchant = await MerchantService.getMerchantByStripeUserId(
        event.account as string
      );
      const paymentIntent = await stripe.paymentIntents.retrieve(
        event.data.object.payment_intent as string,
        {
          stripeAccount: event.account,
        }
      );

      const store = await getStoreByUserId(merchant.id);

      await createSale({
        stripePaymentIntentId: paymentIntent.id,
        amount: `${amount / 100}`,
        storeId: store.id,
        legCommission: `${transferAmount / 100}`,
        firstLevelPartnerCommission: `${
          Math.round(amount * FIRST_LEVEL_PARTNER_FEE_RATE * VAT) / 100
        }`,
        secondLevelPartnerCommission: `${
          Math.round(amount * SECOND_LEVEL_PARTNER_FEE_RATE * VAT) / 100
        }`,
      });
    } else if (event.type === "account.updated") {
      const stripeAccount = event.data.object;
      let merchant;
      if (
        stripeAccount.requirements?.currently_due?.length === 0 &&
        (merchant = await MerchantService.getMerchantByStripeUserId(
          stripeAccount.id
        ))?.status === "pending"
      ) {
        await MerchantService.initMerchant(merchant.id);
      }
    }
    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("⚠️  Webhook Error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
