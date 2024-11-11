"use server";

import { updateUser, getBusinessTypes } from "@/app/db";
import { MerchantService } from "@/app/services/merchantService";
import { UserService } from "@/app/services/userService";
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
    businessTypeId: await numericEnum(businessTypeIds),
  });

  // Parse and validate the form data
  const validation = await updateUserSchema.safeParseAsync({
    email: formData.get("email"),
    businessTypeId: Number(formData.get("businessType")),
    businessName: formData.get("businessName"),
  });

  if (!validation.success) {
    return formatZodErrors(validation)
  }

  const { email, businessTypeId, businessName} = validation.data;

  // Check if the user exists before updating
  const existingUser = await UserService.getUserByEmail(email);
  if (!existingUser) {
    throw new Error('Errore in admin - modifica utente: Utente non trovato')
  }

  // Update the user
  await MerchantService.updateMerchantBusinessInfo(email, businessTypeId, businessName);
  
  redirect("/admin/users?success=true&action=update");
}
