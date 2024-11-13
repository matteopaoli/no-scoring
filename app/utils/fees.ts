import { LEG_FEE_RATE, STRIPE_FEE_FIXED, STRIPE_FEE_VAR, VAT } from "../constants";

export function getAmountWithFees(amount: number) {
    const commission = (amount * (STRIPE_FEE_VAR + LEG_FEE_RATE) + STRIPE_FEE_FIXED) * VAT;
    return amount + commission; // Add commission to price
}