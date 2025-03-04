"use server";

import { getMerchantIdsFromPartnerId, getPartnerNetwork, updatePartner } from "@/app/db";
import { UserService } from "@/app/services/userService";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
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
    regionId: z.string().min(1, "Selezionare una provincia valida").transform(v => Number(v))
  });

  // Parse and validate the form data
  const validation = await updatePartnerSchema.safeParseAsync({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    regionId: formData.get("regionId"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { email, firstName, lastName, regionId } = validation.data;
  const user = await getUserFromAuth();
  // Check if the user exists before updating
  const existingUser = await UserService.getUserByEmail(email);
  const partnerIds = await getPartnerNetwork(user.id);

  if (!existingUser) {
    throw new Error("Errore in admin - modifica utente: Utente non trovato");
  }

  if (!partnerIds.includes(existingUser.id)) {
    throw new Error('Unauthorized')
  }

  // Update the user
  await updatePartner({ id: existingUser.id, firstName, lastName, regionId });

  redirect("/admin/partners?success=true&action=update");
}
