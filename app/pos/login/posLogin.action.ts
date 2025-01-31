"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../auth";
import { z } from "zod";
import formatZodErrors from "@/app/utils/formatZodErrors";
import { UserService } from "@/app/services/userService";
import { User } from "@/app/db";

export default async function posLoginAction(
  prevState: Record<string, any>,
  formData: FormData
) {
  const validator = z
    .string()
    .min(1, "Inserire un indirizzo email valido")
    .email("Inserire un indirizzo email valido") // Add email format validation
    .trim()
    .transform((email) => email.toLowerCase());
  const validation = validator.safeParse(formData.get("email"));

  if (!validation.success) {
    return {
      status: "error",
      errors: formatZodErrors(validation),
    };
  }
  try {
    const user = await UserService.getUserByEmail(validation.data);
    if (user && !["user", "pos"].includes(user.role)) {
      throw new Error("Invalid role for this service");
    }
    await signIn("posMagicLinkLogin", {
      email: validation.data,
      redirectTo: "/pos/view",
      redirect: false,
      roles: ["pos"],
    });
    return {
      status: "success",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}
