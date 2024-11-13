"use server";

import { redirect } from "next/navigation";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateNewPayment from "@/app/formSchemas/newPaymentSchema";
import Stripe from "stripe";
import { getAmountWithCommissions } from "../utils/fees";
import { FEES_DISCLAIMER } from "../constants";
import { createPaymentLink } from "../utils/stripe";
import { generateQrCodeWithLogo } from "../utils/images";

export default async function updateUserAction(
  prevState,
  formData: FormData
): FormActionReturnType {
  const validation = validateNewPayment(formData);

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  let { amount, includeCommission } = validation.data;
  const user = await getUserFromAuth();
  if (!user?.email) {
    redirect("/login");
  }
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    stripeAccount: user.stripeUserId,
  });

  if (includeCommission) {
    amount = getAmountWithCommissions(amount);
  }

  const product = await stripe.products.create({
    name: "Pagamento istantaneo",
    description: includeCommission ? FEES_DISCLAIMER : undefined,
    images: [],
    default_price_data: {
      currency: "eur",
      unit_amount: Math.round(amount * 100),
    },
  });

  const paymentLink = await createPaymentLink(stripe, product.id);
  const qrcode = await generateQrCodeWithLogo(paymentLink.url);

  return { paymentLink, qrcode };
}
