import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MessagingService]
})
export class MessagingModule {}
