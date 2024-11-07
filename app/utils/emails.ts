import {
  SESClient,
  SendEmailCommand,
  SendRawEmailCommand,
} from "@aws-sdk/client-ses";
import Handlebars from "handlebars";
import { getAdmins, Lead, User } from "../db";
import { resolve } from "path";
import { readFileSync } from "fs";

const sesClient = new SESClient({ region: "eu-west-3" });

interface SendEmailParams {
  recipients: string[];
  templateName: string;
  data: Record<string, any>;
}

async function sendEmail({
  recipients,
  templateName,
  data,
}: SendEmailParams): Promise<void> {
  const template = readFileSync(resolve(process.cwd(), `app/utils/templates/${templateName}.hbs`), 'utf-8')
  const compiledTemplate = Handlebars.compile(template)
  const renderedEmail = compiledTemplate({
    ...data,
    to: recipients.join(", "),
    date: new Date().toUTCString(),
  });

  try {
    const command = new SendRawEmailCommand({
      RawMessage: {
        Data: Buffer.from(renderedEmail),
      },
    });
    await sesClient.send(command);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendNewLeadEmailToAdmin(lead: Lead, referrerName: string) {
  const recipients = (await getAdmins())
    .map((admin) => admin.email)
    .filter(Boolean) as string[];
  if (recipients) {
    await sendEmail({
      recipients,
      templateName: 'newLeadAdmin',
      data: {
        leadName: `${lead.firstName} ${lead.lastName}`,
        referrerName,
      },
    });
  }
}

export async function sendNewLeadEmailToLead(lead: Lead) {
  return await sendEmail({
    recipients: [lead.email],
    templateName: 'leadReportNotification',
    data: {
      leadName: `${lead.firstName}`,
    },
  });
}
