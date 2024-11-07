"use server";

import { createLead } from "@/app/db";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateLead from "@/app/formSchemas/referLeadSchema";

export default async function referLeadAction(
  prevState,
  formData: FormData
): FormActionReturnType {
  const validation = await validateLead(formData);

  if (!validation.success) {
    return formatZodErrors(validation);
  }


  const { firstName, lastName, email, businessName, phoneNumber, sector } =
    validation.data;
  const user = await getUserFromAuth();

  const lead = {
    email: email,
    referredByUserId: user.id,
    firstName,
    lastName,
    businessName,
    phoneNumber,
    sector
  };

  await createLead(lead, `${user.firstName} ${user.lastName}`);

  return []
}
