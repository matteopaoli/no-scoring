"use server";

import {
  getBusinessTypes,
  getPartnerById,
  getUser,
  getUserByStripeAccountId,
} from "@/app/db";
import { MerchantService } from "@/app/services/merchantService";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { z, ZodType } from "zod";

export async function numericEnum<TValues extends readonly number[]>(
  values: TValues
) {
  return z.number().superRefine((val, ctx) => {
    if (!values.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        options: [...values],
        received: val,
        message: "Opzione non valida",
      });
    }
  }) as ZodType<TValues[number]>;
}

export default async function createUserAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const businessTypeIds = (await getBusinessTypes()).map((b) => b.id);

  const createUserSchema = z.object({
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .trim()
      .refine(async (email) => !(await getUser(email)), {
        message: "L'utente esiste già",
      }),
    businessName: z.string().min(1, "Inserire un nome valido"),
    businessTypeId: await numericEnum(businessTypeIds),
    partner: z
      .string()
      .nullable()
      .refine(
        async (partnerId) => {
          if (partnerId === null) return true; // Allow null values.
          return Boolean((await getPartnerById(partnerId))?.id);
        },
        { message: "Il partner non esiste" }
      ),
  });

  // Validate form data against the schema
  const validation = await createUserSchema.safeParseAsync({
    email: formData.get("email"),
    businessTypeId: Number(formData.get("businessTypeId")),
    businessName: formData.get("businessName"),
    partner: formData.get("partner"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const {
    email,
    businessTypeId,
    businessName,
    partner,
  } = validation.data;

  const existingUserByEmail = await getUser(email);

  if (existingUserByEmail) {
    return [{ field: "email", message: "L'utente esiste già" }];
  }

  const stripe = new Stripe(process.env.STRIPE_API_KEY!);

  const merchantAccount = await stripe.accounts.create({
    country: 'IT',
    email,
    controller: {
      fees: {
        payer: "account",
      },
      losses: {
        payments: 'stripe',
      },
      stripe_dashboard: {
        type: 'full',
      },
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: merchantAccount.id,
    refresh_url: `${process.env.BASE_URL}/api/stripe/refresh-url?accountId=${merchantAccount.id}`,
    return_url: `${process.env.BASE_URL}/login`,
    type: "account_onboarding",
  });

  if (!accountLink.url) {
    throw new Error("Could not create account link");
  }

  await MerchantService.createMerchant({
    email,
    businessTypeId,
    businessName,
    onboardingLink: accountLink.url,
    stripeUserId: merchantAccount.id
  });

  redirect(`/admin/users?success=true&action=create&accountLink=${encodeURI(accountLink.url)}`);
}
