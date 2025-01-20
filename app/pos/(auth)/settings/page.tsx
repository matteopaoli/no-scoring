import { getStoreByUserId } from "@/app/db";
import { redirect } from "next/navigation";
import Client from './page.client';
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function EditUserPage() {
    const user = await getUserFromAuth();

    if (!user) {
        redirect('/login'); // Redirect if no user is found
    }

    if (user.role === 'user') {
        redirect('/app/settings/user')
    }

    return (
        <>
            <Client user={user} />
        </>
    );
}
