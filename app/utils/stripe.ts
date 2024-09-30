import Stripe from "stripe";
import { getProduct } from "../db";

// Function to retrieve all payment links, handling pagination
async function getAllPaymentLinks(
  stripe: Stripe
): Promise<Stripe.PaymentLink[]> {
  let paymentLinks: Stripe.PaymentLink[] = [];
  let hasMore = true;
  let startingAfter: string | null = null;

  while (hasMore) {
    const response = await stripe.paymentLinks.list({
      limit: 100, // Maximum number of payment links to retrieve
      starting_after: startingAfter || undefined,
    });

    paymentLinks = paymentLinks.concat(response.data);
    hasMore = response.has_more;

    // Update the startingAfter to the last item in the current response
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return paymentLinks;
}

export async function createPaymentLink(stripe: Stripe, productId: string) {
  try {
    const price = (await stripe.prices.list({ product: productId })).data[0];
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
    });
    return paymentLink.id;
  } catch (error) {
    console.error("Error retrieving or creating payment link:", error);
    throw new Error("Unable to retrieve or create payment link");
  }
}

export async function getPaymentLinkUrl(stripe: Stripe, paymentLinkId: string): Promise<string> {
  return (await stripe.paymentLinks.retrieve(paymentLinkId)).url
} 

export async function createGenericProduct(stripe: Stripe) {
  const product = await stripe.products.create({
    name: 'Prodotto generico'
  })

  const price = await stripe.prices.create({
    custom_unit_amount: {
      enabled: true,
    },
    currency: 'eur',
    product: product.id
  })

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1
      }
    ]
  })
  return {
    productId: product.id,
    paymentLink: paymentLink
  }
}