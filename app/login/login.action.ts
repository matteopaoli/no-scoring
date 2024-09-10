"use server";

import { signIn } from "../auth";

export default async function login(formData: FormData) {
  await signIn("credentials", {
    redirectTo: "/protected",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}
