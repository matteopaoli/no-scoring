import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class MailerService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: 'eu-west-3' });
  }

  /**
   * Core function to send email using AWS SES
   * @param recipients - List of email addresses
   * @param templateName - Name of the Handlebars template
   * @param data - Data to be injected into the template
   */
  async sendEmail(
    recipients: string[],
    templateName: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const templatePath = resolve(
        process.cwd(),
        `src/mailer/templates/${templateName}.hbs`,
      );
      const template = readFileSync(templatePath, 'utf-8');

      // Compile the template
      const compiledTemplate = Handlebars.compile(template);

      // Render the email content
      const renderedEmail = compiledTemplate({
        ...data,
        to: recipients.join(', '),
        date: new Date().toUTCString(),
      });

      // Prepare SES raw email command with headers and body
      const command = new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from(renderedEmail),
        },
      });

      // Send the email via SES
      await this.sesClient.send(command);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
