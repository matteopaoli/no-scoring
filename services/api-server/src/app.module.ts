import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MapsModule } from './maps/maps.module';
import { StoreController } from './store/store.controller';
import { StoreService } from './store/store.service';
import { PaymentModule } from './payment/payment.module';
import { BusinessTypeController } from './business-type/business-type.controller';
import { BusinessTypeService } from './business-type/business-type.service';
import { BusinessTypeModule } from './business-type/business-type.module';
import { TosModule } from './tos/tos.module';
import { ExternalModule } from './external/external.module';
import { CustomerModule } from './customer/customer.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    MailerModule,
    MapsModule,
    PaymentModule,
    BusinessTypeModule,
    TosModule,
    ExternalModule,
    CustomerModule,
    GeolocationModule,
    MessagingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    StoreService,
    BusinessTypeService,
  ],
  controllers: [StoreController, BusinessTypeController],
})
export class AppModule {}
