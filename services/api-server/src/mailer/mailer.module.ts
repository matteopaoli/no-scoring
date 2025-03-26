import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],  // Export the service to use it in other modules
})
export class MailerModule {}
