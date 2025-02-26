"use server";

import { updatePartner } from "@/app/db";
import { UserService } from "@/app/services/userService";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function updateUserAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {

  const updatePartnerSchema = z.object({
    firstName: z.string().min(1, "Inserire un nome valido").trim(),
    lastName: z.string().min(1, "Inserire un cognome valido").trim(),
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .trim(),
    provincia: z.string().min(1, "Selezionare una provincia valida"),
  });

  // Parse and validate the form data
  const validation = await updatePartnerSchema.safeParseAsync({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    provincia: formData.get("provincia"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { email, firstName, lastName, provincia } = validation.data;

  // Check if the user exists before updating
  const existingUser = await UserService.getUserByEmail(email);
  if (!existingUser) {
    throw new Error("Errore in admin - modifica utente: Utente non trovato");
  }

  // Update the user
  await updatePartner({ id: existingUser.id, firstName, lastName, provincia });

  redirect("/admin/partners?success=true&action=update");
}
