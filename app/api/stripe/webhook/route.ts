import { getUserByStripeAccountId, getWebhookSecret } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const searchParams = request.nextUrl.searchParams;
  const merchantAccountId = searchParams.get("merchantId");

  if (!merchantAccountId) {
    throw new Error("No merchant account param");
  }

  const merchant = await getUserByStripeAccountId(merchantAccountId);
  if (!merchant) {
    throw new Error("Merchant not found");
  }

  const stripe = new Stripe(merchant.stripeSecretKey);
  const webhook = await getWebhookSecret(merchantAccountId);
  // webhook.secret = 'whsec_88ee09d943ae2353bfa77ed1ca6242975826e5303ddfaeaa1fa854d1123c6cd1'

  if (!webhook) {
    throw new Error("No secret in db");
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    if (!sig) {
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhook.secret);

    if (event.type === "checkout.session.completed") {
      const LEG_COMMISSION_RATE = 0.015;
      const VAT = 1.22;

      const session = event.data.object as Stripe.Checkout.Session;

      const amount = session.amount_total; // Amount is in cents

      const transferAmount = Math.round(amount * LEG_COMMISSION_RATE * VAT);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        event.data.object.payment_intent as string
      );
      const stripePlatform = new Stripe(
        "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"
      );
      // await stripePlatform.transfers.create({
      //   amount: transferAmount,
      //   currency: session.currency,
      //   destination: 'acct_1PyWpZIIgj1Vgarr',
      //   description: `Transfer for session ${session.id}`,
      //   }, {
      //   stripeAccount: merchant.stripeUserId
      // });

      const charge = await stripePlatform.charges.create({
        amount: 50,
        currency: session.currency,
        source: merchant.stripeUserId,
      });
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("⚠️  Webhook Error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
