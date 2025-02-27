'use server'

import { MerchantService } from "@/app/services/merchantService"

export default async function updateNotesAction(userId: string, value: string) {
    if (value) await MerchantService.updateNotes(userId, value)
}