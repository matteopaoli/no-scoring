"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../auth";

export default async function login(prevState: Record<string, any>, formData: FormData): Promise<Record<string, any>> {
  try {
    await signIn("credentials", {
      redirectTo: "/en/app",
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    return {
      status: "success"
    }
  }
  catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { msg: "Invalid credentials" , status: "error"};
        default:
            return { msg: "Something went wrong", status: "error" };
      }
    }
    return {
      msg: "Something went wrong", status: "error"
    }
  }
}
