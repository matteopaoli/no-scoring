"use server";

import { deleteLead } from "@/app/db";

export default async function deleteLeadAction(leadId: string) {
  await deleteLead(leadId);
}
