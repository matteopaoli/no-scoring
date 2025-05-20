import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { BusinessTypeService } from 'src/business-type/business-type.service';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { UsersService } from 'src/users/users.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CustomerController],
  providers: [CustomerService, BusinessTypeService, GeolocationService, UsersService, MessagingService],
})
export class CustomerModule { }
