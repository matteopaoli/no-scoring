'use server'

import { getUser } from "@/app/db";

export async function checkProfileCompletion(email: string) {
  const user = await getUser(email);
  return user.firstName && user.lastName;
}
