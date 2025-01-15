import { UserService } from "../services/userService";

export default async function sendVerificationRequest({ identifier: email, url }: { identifier: string, url: string }) {
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  await UserService.saveMagicLink(user?.id, url);
}