import { LEG_FEE_RATE, STRIPE_FEE_FIXED, STRIPE_FEE_VAR, VAT } from "../constants";

export function getAmountWithFees(amount: number) {
    const stripeFeeVarVAT = STRIPE_FEE_VAR * VAT;
    const legFeeRateVAT = LEG_FEE_RATE * VAT;
    const stripeFeeFixedVAT = STRIPE_FEE_FIXED * VAT;
    
    const totalFeeRateVAT = stripeFeeVarVAT + legFeeRateVAT;
  
    return (amount + stripeFeeFixedVAT) / (1 - totalFeeRateVAT);
}