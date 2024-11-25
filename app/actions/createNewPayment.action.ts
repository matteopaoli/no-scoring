"use server";

import { redirect } from "next/navigation";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateNewPayment from "@/app/formSchemas/newPaymentSchema";
import Stripe from "stripe";
import { getAmountWithFees } from "../utils/fees";
import { FEES_DISCLAIMER } from "../constants";
import { createPaymentLink } from "../utils/stripe";
import { generateQrCodeWithLogo } from "../utils/images";
import { ProductService } from "../services/productService";

export default async function createNewPaymentAction(
  prevState: Awaited<FormActionReturnTypeWithStatus>,
  formData: FormData
): FormActionReturnTypeWithStatus {
  const validation = validateNewPayment(formData);

  if (!validation.success) {
    return {
      status: "error",
      errors: formatZodErrors(validation),
    }
  }

  let { amount, includeFees } = validation.data;
  const user = await getUserFromAuth();
  if (!user?.email) {
    redirect("/login");
  }

  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    stripeAccount: user.stripeUserId,
  });

  if (includeFees) {
    amount = getAmountWithFees(amount);
  }

  const { paymentLink, qrcode } = await ProductService.createInstantPayment(amount, user, includeFees);
  

  return { status: 'success', paymentLink: paymentLink.url, qrcode, errors: [] };
}
