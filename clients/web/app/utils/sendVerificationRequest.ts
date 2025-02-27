import { UserService } from "../services/userService";
import { magicLink } from "./emails";

export async function sendVerificationRequestCreate({ identifier: email, url }: { identifier: string, url: string }) {
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  await UserService.saveMagicLink(user?.id, url);
  await magicLink({ email, url });
}

export async function sendVerificationRequestLogin({ identifier: email, url }: { identifier: string, url: string }) {
  const user = await UserService.getUserByEmail(email);
  if (user?.role !== "pos") {
    throw new Error("Not a POS")
  }
  await magicLink({ email, url });
}