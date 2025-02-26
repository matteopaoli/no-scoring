'use server';

import { Store } from "@/app/services/storeService";

export default async function changeStoreStatus(storeId: string, value: boolean) {
    return Store.updateStatus(storeId, value)
}