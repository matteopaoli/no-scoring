'use server';

import { createBusinessType } from "@/app/db";
import { z } from "zod";

// Schema for commission rules
const commissionRuleSchema = z.object({
  minAmount: z.number().min(0, "Minimum amount must be at least 0"),
  maxAmount: z.number().optional().nullable(),
  commissionType: z.enum(["fixed", "percentage"], { required_error: "Commission type is required" }),
  commissionValue: z.number().positive("Commission value must be greater than 0"),
});

// Schema for creating a business type
const createBusinessTypeSchema = z.object({
  businessTypeName: z.string().min(1, "Business Type name is required"),
  commissionRules: z.array(commissionRuleSchema),
});

function doCommissionRulesOverlap(rule1, rule2) {
  const rule1Max = rule1.maxAmount ?? Infinity;
  const rule2Max = rule2.maxAmount ?? Infinity;

  return (
    (rule1.minAmount <= rule2Max && rule1Max >= rule2.minAmount) ||
    (rule2.minAmount <= rule1Max && rule2Max >= rule1.minAmount)
  );
}

export async function createBusinessTypeAction(prevState, formData: FormData) {
  const parsedData = createBusinessTypeSchema.safeParse({
    businessTypeName: formData.get('businessTypeName'),
    commissionRules: formData.getAll('commissionRules')
  });

  for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }
  if (!parsedData.success) {
    return { issues: parsedData.error.errors };
  }

  const { businessTypeName, commissionRules } = parsedData.data;

  // Check for overlapping commission rules
  for (let i = 0; i < commissionRules.length; i++) {
    for (let j = i + 1; j < commissionRules.length; j++) {
      if (doCommissionRulesOverlap(commissionRules[i], commissionRules[j])) {
        return {
          issues: [{
            path: ["commissionRules"],
            message: `Commission rule at index ${i} overlaps with rule at index ${j}.`,
          }],
        };
      }
    }
  }

  // Save the new business type and its commission rules to the database
  await createBusinessType({ name: businessTypeName, commissionRules });

  return { success: true };
}
