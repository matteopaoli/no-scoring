"use server";

import { signOut } from "./auth";

export default async function logout(redirectUrl: string) {
  if (redirectUrl) {
    await signOut({ redirectTo: redirectUrl })
  }
  else await signOut();
}
