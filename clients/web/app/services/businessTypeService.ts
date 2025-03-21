import { businessType, commissionRules, db } from "@paytomorrow/db";
import { BusinessType } from "../db";
import { eq } from "drizzle-orm";
import React from "react";

export class BusinessTypeService {
  static async getAll() {
    const result = await db
      .select({
        id: businessType.id,
        name: businessType.name,
        commissionRuleId: commissionRules.id,
        minAmount: commissionRules.minAmount,
        maxAmount: commissionRules.maxAmount,
        commissionType: commissionRules.commissionType,
        commissionValue: commissionRules.commissionValue,
      })
      .from(businessType)
      .leftJoin(
        commissionRules,
        eq(commissionRules.businessTypeId, businessType.id)
      );

    // Group commission rules by businessType
    const groupedResult: Record<number, BusinessType> = {};

    result.forEach((row) => {
      const {
        id,
        name,
        commissionRuleId,
        minAmount,
        maxAmount,
        commissionType,
        commissionValue,
      } = row;

      if (!groupedResult[id]) {
        groupedResult[id] = {
          id,
          name,
          commissionRules: [],
        };
      }

      if (commissionRuleId !== null) {
        groupedResult[id].commissionRules.push({
          id: commissionRuleId,
          minAmount: Number(minAmount),
          maxAmount: maxAmount !== null ? Number(maxAmount) : null,
          commissionType: commissionType!,
          commissionValue: Number(commissionValue),
        });
      }
    });

    return Object.values(groupedResult);
  }

  static async getAllAsComponent() {
    const businessTypes = await BusinessTypeService.getAll();
    
    const businessTypesOptions = businessTypes.map((b) => 
      React.createElement("option", { value: b.id, key: b.id }, b.name)
    );
  
    return businessTypesOptions;
  }
}
