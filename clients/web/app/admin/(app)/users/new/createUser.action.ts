"use server";

import { getPartnerById } from "@/app/db";
import { BusinessTypeService } from "@/app/services/businessTypeService";
import { MerchantService } from "@/app/services/merchantService";
import { UserService } from "@/app/services/userService";
import { FormActionReturnType } from "@/app/types";
import { accountCreatedMerchantEmail } from "@/app/utils/emails";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
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
  const creator = await getUserFromAuth();

  if (!UserService.isPartner(creator) && !UserService.isAdmin(creator)) {
    throw new Error("unauthorized");
  }

  const businessTypeIds = (await BusinessTypeService.getAll()).map((b) => b.id);
  const createUserSchema = z.object({
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .trim()
      .transform((email) => email.toLowerCase())
      .refine(async (email) => !(await UserService.getUserByEmail(email)), {
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
    phoneNumber: z
      .string()
      .regex(
        /^(\+39\s?)?\d{6,10}$/,
        "Inserire un numero di telefono valido (es. +39 123 456 7890)"
      ),
    refName: z.string().min(1, "Inserire un nome valido"),
    regionId: z.string().min(1, "Selezionare una provincia valida").transform(v => Number(v))
  });

  // Validate form data against the schema
  const validation = await createUserSchema.safeParseAsync({
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    businessTypeId: Number(formData.get("businessTypeId")),
    businessName: formData.get("businessName"),
    partner: formData.get("partner"),
    refName: formData.get("refName"),
    regionId: formData.get("regionId"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const {
    email,
    businessTypeId,
    businessName,
    partner: partnerId,
    phoneNumber,
    refName,
    regionId,
  } = validation.data;

  const stripe = new Stripe(process.env.STRIPE_API_KEY!);

  const merchantAccount = await stripe.accounts.create({
    country: "IT",
    email,
    controller: {
      fees: {
        payer: "account",
      },
      losses: {
        payments: "stripe",
      },
      stripe_dashboard: {
        type: "full",
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
    stripeUserId: merchantAccount.id,
    partnerId: partnerId ?? undefined,
    phoneNumber,
    refName,
    regionId,
  });

  accountCreatedMerchantEmail({ email, onboardingLink: accountLink.url });
  redirect(`/admin/users?success=true&action=create`);
}
