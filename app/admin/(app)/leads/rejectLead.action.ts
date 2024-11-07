"use server";

import { rejectLead } from "@/app/db";

export default async function rejectLeadAction(leadId: string) {
  await rejectLead(leadId);
}
