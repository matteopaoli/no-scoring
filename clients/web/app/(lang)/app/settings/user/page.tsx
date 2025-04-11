import { getStoreByUserId } from "@/app/db";
import { redirect } from "next/navigation";
import Client from './page.client';
import getUserFromAuth from "@/app/utils/getUserFromAuth";
import { Store } from "@/app/services/storeService";

export default async function EditUserPage() {
    const user = await getUserFromAuth();
    const store = await Store.getStoreByUserId(user.id)

    if (!user) {
        redirect('/app/dashboard'); // Redirect if no user is found
    }

    return (
        <>
            <Client user={user} store={store} />
        </>
    );
}
