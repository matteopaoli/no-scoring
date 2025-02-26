"use server";

import { acceptTOS } from "@/app/db";
import { FormActionReturnTypeWithStatus } from "@/app/types";
import formatZodErrors from "@/app/utils/formatZodErrors";
import getUserFromAuth from "@/app/utils/getUserFromAuth";;
import { z } from "zod";

export async function acceptTosAction(
  prevState: Awaited<FormActionReturnTypeWithStatus>,
  formData: FormData
): FormActionReturnTypeWithStatus {
  const acceptTosSchema = z.object({
    accept: z.literal("on", {
      errorMap: () => ({
        message: "Devi accettare i termini e le condizioni per continuare",
      }),
    }),
  });

  const user = await getUserFromAuth();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  if (user.role !== "user") {
    throw new Error("User is not a merchant");
  }

  const validation = acceptTosSchema.safeParse({
    accept: formData.get("accept"),
  });

  if (!validation.success) {
    return {
      status: "error",
      errors: formatZodErrors(validation)
    }
  }

  await acceptTOS(user.id);

  return {
    status: 'success'
  }
}
