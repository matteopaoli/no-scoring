"use server";

import { redirect } from "next/navigation";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateNewPayment from "@/app/formSchemas/newPaymentSchema";
import { getAmountWithFees } from "../utils/fees";
import { ProductService } from "../services/productService";
import { getStoreByUserId } from "../db";
import { Store } from "../services/storeService";

export default async function createNewPaymentAction(
  prevState: Awaited<FormActionReturnTypeWithStatus<{paymentLink?: string, qrcode?: string}>>,
  formData: FormData
): FormActionReturnTypeWithStatus<{paymentLink?: string, qrcode?: string}> {
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
  let stripeUserId = user.stripeUserId;

  if (user.role === 'pos') {
    const store = await getStoreByUserId(user.id);
    stripeUserId = await Store.getStripeUserId(store.id)
  }

  if (includeFees) {
    amount = getAmountWithFees(amount);
  }

  const { paymentLink, qrcode } = await ProductService.createInstantPayment(amount, user, includeFees, stripeUserId);
  

  return { status: 'success', paymentLink: paymentLink.url, qrcode, errors: [] };
}
