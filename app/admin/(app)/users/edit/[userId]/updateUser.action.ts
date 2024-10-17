"use server";

import { updateUser, getBusinessTypes, getUser } from "@/app/db";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { redirect } from "next/navigation";
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

export default async function updateUserAction(
  prevState: string | null,
  formData: FormData
): FormActionReturnType {
  const businessTypeIds = (await getBusinessTypes()).map((b) => b.id);

  const updateUserSchema = z.object({
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido"), // Email format validation
    businessName: z.string().min(1, "Inserire un nome valido"),
    stripeApiKey: z
      .string()
      .regex(
        /^sk_live_[0-9a-zA-Z]{24,}/,
        "Inserire una Chiave Segreta valida (sk_live_************************)"
      ), // Stripe API key validation
    businessTypeId: await numericEnum(businessTypeIds),
    stripeUserId: z.string().regex(/^acct_[a-zA-Z0-9]+$/, {
      message: "Il formato dell'ID utente di Stripe non è valido. Dovrebbe iniziare con 'acct_' seguito da caratteri alfanumerici.",
    }),
    stripeLegAccountId: z.string().regex(/^acct_[a-zA-Z0-9]+$/, {
      message: "Il formato dell'ID LEG di Stripe non è valido. Dovrebbe iniziare con 'acct_' seguito da caratteri alfanumerici.",
    })
  });

  // Parse and validate the form data
  const validation = await updateUserSchema.safeParseAsync({
    email: formData.get("email"),
    stripeApiKey: formData.get("stripeApiKey"),
    businessTypeId: Number(formData.get("businessType")),
    businessName: formData.get("businessName"),
    stripeUserId: formData.get('stripeUserId'),
    stripeLegAccountId: formData.get('stripeLegAccountId')
  });

  if (!validation.success) {
    return formatZodErrors(validation)
  }

  const { email, stripeApiKey, businessTypeId, businessName, stripeUserId, stripeLegAccountId } = validation.data;

  // Check if the user exists before updating
  const existingUser = await getUser(email);
  if (!existingUser) {
    throw new Error('Errore in admin - modifica utente: Utente non trovato')
  }

  // Update the user
  await updateUser(email, stripeApiKey, businessTypeId, businessName, stripeUserId, stripeLegAccountId);
  
  redirect("/admin/users?success=true&action=update");
}
