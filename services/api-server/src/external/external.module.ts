import { Module } from '@nestjs/common';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { StoreService } from '../store/store.service'; // adjust path as needed
import { PaymentService } from 'src/payment/payment.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ExternalController],
  providers: [ExternalService, StoreService, PaymentService, UsersService],
})
export class ExternalModule {}
