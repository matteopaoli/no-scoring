'use server';

import { Store } from "@/app/services/storeService";
import { UserService } from "@/app/services/userService";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function changeStoreStatus(storeId: string, value: boolean) {
    if (UserService.isAdmin(await getUserFromAuth())) {
        return Store.updateStatus(storeId, value)
    }
    else throw new Error("unauthorized")
}