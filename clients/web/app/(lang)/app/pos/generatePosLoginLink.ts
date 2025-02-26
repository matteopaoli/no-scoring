import { signIn } from "@/app/auth";
import { UserService } from "@/app/services/userService";

export default async function generatePosLoginLink(posId: string) {
    let pos = await UserService.getUserById(posId);
    if (!pos.id) throw new Error('POS not found');
    await signIn('posMagicLinkCreation', { email: pos.email, redirect: false, redirectTo: '/pos/view' });
    pos = await UserService.getUserById(posId);
    return pos.magicLinkUrl;
}