"use server";

import { updateProfile } from "@/app/db";
import { redirect } from "next/navigation";
import { FormActionReturnType } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import validateUserSettings from "@/app/formSchemas/userSettingsSchema";

export default async function updateUserAction(prevState, formData: FormData): FormActionReturnType {
  const validation = validateUserSettings(formData);

  if (!validation.success) {
    return formatZodErrors(validation);
  }

  const { firstName, lastName, password, image } = validation.data;
  const user = await getUserFromAuth();
  if (!user?.email) {
    redirect("/login");
  }

  const updateData = {
    email: user.email,
    firstName,
    lastName,
    profileImage: image,
    ...(password? { password } : {})
  };
 
  await updateProfile(updateData);
  if (user.role === 'admin') {
    redirect('/admin?success=true"')
  }

  if (['partner', 'subpartner'].includes(user.role)) {
    redirect('/partner?success=true')
  }

  redirect("/app?success=true");
}
