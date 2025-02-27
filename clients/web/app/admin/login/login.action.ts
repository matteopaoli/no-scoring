"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../auth";
import { redirect } from "next/navigation";

export default async function login(
  prevState:
    | {
        error?: string;
      }
    | undefined,
  formData: FormData
): Promise<
  | {
      error?: string;
    }
  | undefined
> {
  try {
    await signIn("credentials", {
      email: formData.get("email")?.toString().toLowerCase(),
      password: formData.get("password"),
      redirectTo: "/admin",
      roles: ["admin"],
    });
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
