"use server";

import { acceptLead } from "@/app/db";

export default async function acceptLeadAction(leadId: string) {
  await acceptLead(leadId);
}
