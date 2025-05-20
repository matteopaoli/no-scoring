type CreateMerchantDTO = {
    email: string,
    businessTypeId: number,
    regionId: number,
    partnerId?: string,
    businessName: string,
    refName: string,
    phoneNumber: string,
    referrerCustomerId: string,
    notes?: string
}