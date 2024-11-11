"use server";

import { auth } from "@/app/auth";
import { createSubPartner } from "@/app/db";
import { UserService } from "@/app/services/userService";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function createPartnerAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const createPartnerSchema = z.object({
    firstName: z.string().min(1, "Inserire un nome valido").trim(),
    lastName: z.string().min(1, "Inserire un cognome valido").trim(),
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .trim()
      .refine(async (email) => !(await UserService.getUserByEmail(email)), {
        message: "L'utente esiste già",
      }),
    provincia: z.string().min(1, "Selezionare una provincia valida"),
  });

  // Validate form data against the schema
  const validation = await createPartnerSchema.safeParseAsync({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    provincia: formData.get("provincia"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, email, provincia } = validation.data;
  const partner = await getUserFromAuth();
  const existingUserByEmail = await UserService.getUserByEmail(email);

  if (existingUserByEmail) {
    return [{ field: 'email', message: 'L\'utente esiste già' }];
  }

  // If no existing user, proceed to create the new user
  await createSubPartner({
    firstName,
    lastName,
    email,
    provincia,
    partnerId: partner.id
  });

  redirect("/partner/subpartners?success=true&action=createSubpartner");
}
