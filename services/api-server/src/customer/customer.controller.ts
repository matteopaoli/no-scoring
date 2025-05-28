import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignupCustomerDTO } from './dto/signup-customer.dto';
import { Request } from 'express';
import { CustomerService } from './customer.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ReferMerchantDTO } from './dto/refer-merchant.dto';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('signup')
  async signupCustomer(@Body(new ValidationPipe()) body: SignupCustomerDTO) {
    try {
      return await this.customerService.create(body);
    } catch (error) {
      throw new HttpException(error.message as string, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refer')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('customer')
  async referMerchant(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true })) body: ReferMerchantDTO,
  ) {
    const customerId = req.user?.['sub'];
    if (!customerId) throw new UnauthorizedException();

    return await this.customerService.createMerchantRefer({
      ...body,
      referrerCustomerId: customerId,
    });
  }

  @Get('referred')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('customer')
  async getReferredLeads(@Req() req: Request) {
    const customerId = req.user?.['sub'];
    if (!customerId) throw new UnauthorizedException();
    return this.customerService.getReferredLeads(customerId);
  }
}
