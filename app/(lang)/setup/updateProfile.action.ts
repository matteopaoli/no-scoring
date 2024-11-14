"use server";

import { z } from "zod";
import { updateProfile } from "@/app/db";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateUserSettings from "@/app/formSchemas/userSettingsSchema";

export async function updateProfileAction(
  prevState: Awaited<FormActionReturnTypeWithStatus>,
  formData: FormData
): FormActionReturnTypeWithStatus {
  const user = await getUserFromAuth();

  const validation = validateUserSettings(formData)
  if (!validation.success) {
    return {
      status: "error",
      errors: formatZodErrors(validation),
    };
  }

  const { firstName, lastName, image } = validation.data;

  await updateProfile({ firstName, lastName, profileImage: image, email: user.email });

  return {
    status: "success",
  };
}
