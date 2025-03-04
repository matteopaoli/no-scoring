"use server";

import { createPartner } from "@/app/db";
import { UserService } from "@/app/services/userService";
import { FormActionReturnType } from "@/app/types";
import { partnerWelcomeEmail } from "@/app/utils/emails";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function createPartnerAction(
  prevState: Awaited<FormActionReturnType>,
  formData: FormData
): FormActionReturnType {
  const user = await getUserFromAuth();
  if (!['admin', 'areamanager'].includes(user.role)) {
    throw new Error('Unauthorized');
  }

  const createPartnerSchema = z.object({
    firstName: z.string().min(1, "Inserire un nome valido").trim(),
    lastName: z.string().min(1, "Inserire un cognome valido").trim(),
    email: z
      .string()
      .min(1, "Inserire un indirizzo email valido")
      .email("Inserire un indirizzo email valido") // Add email format validation
      .trim()
      .transform((email) => email.toLowerCase())
      .refine(async (email) => !(await UserService.getUserByEmail(email)), {
        message: "L'utente esiste già",
      }),
    regionId: z.string().min(1, "Selezionare una provincia valida").transform(v => Number(v))
  });

  // Validate form data against the schema
  const validation = await createPartnerSchema.safeParseAsync({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    regionId: formData.get("regionId"),
  });

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, email, regionId } = validation.data;

  // Check for existing user with the same email
  const existingUserByEmail = await UserService.getUserByEmail(email);

  if (existingUserByEmail) {
    return [{ field: 'email', message: 'L\'utente esiste già' }];
  }

  if (user.role === 'areamanager') {
    await createPartner({
      firstName,
      lastName,
      email,
      regionId,
      partnerId: user.id
    });
  }
  else {
    await createPartner({
      firstName,
      lastName,
      email,
      regionId,
    });
  }

  partnerWelcomeEmail({ email, partnerName: `${firstName} ${lastName}` });
  redirect("/admin/partners?success=true&action=createPartner");
}
