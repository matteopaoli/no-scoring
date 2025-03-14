'use server'
import { addPartnerFeeAmount, addSubscriptionAmount, addUpperPartnerFeeAmount } from "@/app/services/subscriptionService"

export default async function updateSubscriptionAction(subscriptionId: string, type: 'paytomorrow' | 'partner' | 'upperPartner', amount: number, partnerId?: string) {
    if (type === 'paytomorrow') addSubscriptionAmount(subscriptionId, amount)
    if (type === 'partner') addPartnerFeeAmount(subscriptionId, amount, partnerId!)
    if (type === 'upperPartner') addUpperPartnerFeeAmount(subscriptionId, amount, partnerId!)
}