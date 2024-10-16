import { getStoreByUserId, getUser } from "@/app/db";
import { redirect } from "next/navigation";
import Client from './page.client';
import { auth } from "@/app/auth";

export default async function EditUserPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login'); // Redirect to login if not authenticated
    }
    const user = await getUser(session.user.email);
    const store = await getStoreByUserId(user.id)

    if (!user) {
        redirect('/app/dashboard'); // Redirect if no user is found
    }

    return (
        <>
            <Client user={user} store={store} />
        </>
    );
}
