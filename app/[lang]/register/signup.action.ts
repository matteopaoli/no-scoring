"use server";

import { createUser, getUser } from "@/app/db";
import { redirect } from "next/navigation";

export default async function register(formData: FormData) {
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  let user = await getUser(email);

  if (user) {
    return "User already exists"; // TODO: Handle errors with useFormStatus
  } else {
    await createUser(email, password);
    redirect("/login");
  }
}
