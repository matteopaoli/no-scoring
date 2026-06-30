// Hardcode AWS credentials for SES
// process.env.AWS_ACCESS_KEY_ID = "";
// process.env.AWS_SECRET_ACCESS_KEY = "";
// process.env.AWS_REGION = "eu-west-3";

// Hardcode Database URL (Needs to be in process.env for schema.ts to load)
// process.env.DATABASE_URL = '';

import { eq } from 'drizzle-orm';
import { MailerService } from '../mailer/mailer.service';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const mailer = new MailerService();

  // Load the schema dynamically AFTER process.env has been configured
  const { db, users } = await import('../../../../packages/db/schema');

  // 🚨 TEST MODE SAFEGUARD 🚨
  // Set this to your email address to test the script locally.
  // Set to null to send to ALL users in the database!
  const TEST_EMAIL: string | null = null; 

  let allUsers;
  if (TEST_EMAIL) {
    console.log(`[TEST MODE] Fetching only the test email: ${TEST_EMAIL}`);
    allUsers = await db.select().from(users).where(eq(users.email, TEST_EMAIL));
  } else {
    console.log(`⚠️ [PRODUCTION MODE] Fetching ALL users! ⚠️`);
    allUsers = await db.select().from(users);
  }

  console.log(`Found ${allUsers.length} user(s) to email.`);

  // Configure the email subject
  const templateName = 'mass-email'; 
  const subject = '🚀 Pay Tomorrow si rinnova — Più veloce, più potente, più servizi per te';

  let successCount = 0;
  let errorCount = 0;

  for (const user of allUsers) {
    if (!user.email) continue;
    
    try {
      console.log(`Sending email to ${user.email}...`);
      await mailer.sendEmail(
        [user.email], 
        templateName, 
        {
          subject
        }
      );
      successCount++;
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
      errorCount++;
    }

    // Rate limiting: wait 100ms between emails to respect SES limits (approx 10 emails/sec)
    await sleep(100);
  }

  console.log(`\nMass email completed!`);
  console.log(`Successfully sent: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error during mass email script:', error);
  process.exit(1);
});
