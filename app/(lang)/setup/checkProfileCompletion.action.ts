'use server'

import { UserService } from "@/app/services/userService";

export async function checkProfileCompletion(email: string) {
  const user = await UserService.getUserByEmail(email);
  return user.firstName && user.lastName;
}
