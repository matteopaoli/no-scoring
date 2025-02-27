"use server";

import { updateLeadStatus } from "@/app/db";

export default async function updateLeadStatusAction(leadId: string, status: string) {
  await updateLeadStatus(leadId, status);
}
