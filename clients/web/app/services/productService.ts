import { products } from "@paytomorrow/db";
import { db, User } from "../db";
import Stripe from 'stripe'
import { FEES_DISCLAIMER } from "../constants";
import { createPaymentLink } from "../utils/stripe";
import { generateQrCodeWithLogo } from "../utils/images";

export class ProductService {
  static async createInstantPayment(amount: number, user: User, hasIncludedFees: boolean, stripeUserId: string) {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, { stripeAccount: stripeUserId });
    const stripeProduct = await stripe.products.create({
      name: "Pagamento istantaneo",
      description: hasIncludedFees ? FEES_DISCLAIMER : undefined,
      images: [],
      default_price_data: {
        currency: "eur",
        unit_amount: Math.round(amount * 100),
      },
    });
  
    const paymentLink = await createPaymentLink(stripe, stripeProduct.id);
    const qrcode = await generateQrCodeWithLogo(paymentLink.url);

    db.insert(products).values({
      id: stripeProduct.id,
      userId: user.id,
      paymentLinkId: paymentLink.id,
      qrcode: qrcode,
      type: 'instantPayment',
    });

    return { paymentLink, qrcode }; 
  }
}
