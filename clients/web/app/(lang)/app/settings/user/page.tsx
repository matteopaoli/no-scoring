import { getStoreByUserId } from "@/app/db";
import { redirect } from "next/navigation";
import Client from './page.client';
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function EditUserPage() {
    const user = await getUserFromAuth();
    console.log(user)
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
