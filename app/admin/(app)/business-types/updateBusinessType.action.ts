'use server';

import { updateBusinessType } from "@/app/db";
import { z } from "zod";

// Define schema for commission rules
const commissionRuleSchema = z.object({
  minAmount: z.number().min(0, "Minimum amount must be at least 0"),
  maxAmount: z.number().optional().nullable(),
  commissionType: z.enum(["fixed", "percentage"], { required_error: "Commission type is required" }),
  commissionValue: z.number().positive("Commission value must be greater than 0"),
});

// Schema for updating business type
const updateBusinessTypeSchema = z.object({
  businessTypeId: z.number(),
  businessTypeName: z.string().min(1, "Business Type name is required"),
  commissionRules: z.array(commissionRuleSchema),
});

export async function updateBusinessTypeAction(prevState, formData) {
  const parsedData = updateBusinessTypeSchema.safeParse(formData);
  if (!parsedData.success) {
    return { issues: parsedData.error.errors };
  }

  const { businessTypeName, commissionRules, businessTypeId } = parsedData.data;

  // Update the business type and its commission rules
  await updateBusinessType(businessTypeId, { name: businessTypeName }, commissionRules);

  return { success: true };
}
