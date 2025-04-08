// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StoreService } from '../store/store.service';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, StoreService, UsersService],
})
export class PaymentModule {}