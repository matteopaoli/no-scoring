'use server'

import { getStoreByUserId } from "@/app/db";
import { UserService } from "@/app/services/userService";

export async function checkProfileCompletion(email: string) {
  let step = 1;
  const user = await UserService.getUserByEmail(email);
  if (user.tosAccepted) step += 2;
  if (user.firstName && user.lastName) step++;

  return step;
}
