"use server";

import { createUser, getBusinessTypes, getUser } from "@/app/db";
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

export default async function createUserAction(
  prevState: string | null,
  formData: FormData
): Promise<string> {
  const businessTypeIds = (await getBusinessTypes()).map((b) => b.id);

  const createUserSchema = z.object({
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .refine(async (email) => !(await getUser(email)), {
        message: "L'utente esiste già",
      }),
    businessName: z.string().min(1, "Inserire un nome valido"),
    stripeApiKey: z
      .string()
      .regex(
        /^sk_live_[0-9a-zA-Z]{24,}/,
        "Inserire una Chiave Segreta valida (sk_live_************************)"
      ), // Stripe API key validation
    businessTypeId: await numericEnum(businessTypeIds),
  });
  createUserSchema.safeParse({
    name: formData.get("email"),
  });
  const validation = await createUserSchema.safeParseAsync({
    email: formData.get("email"),
    stripeApiKey: formData.get("stripeApiKey"),
    businessTypeId: Number(formData.get("businessType")),
    businessName: formData.get("businessName"),
  });
  if (!validation.success) {
    return JSON.stringify(validation.error);
  }

  const { email, stripeApiKey, businessTypeId, businessName } = validation.data;
  await createUser(email, stripeApiKey, businessTypeId, businessName);
  redirect("/admin/users?success=true&action=create");
}
