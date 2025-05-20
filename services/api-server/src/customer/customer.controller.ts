import { Body, Controller, HttpException, HttpStatus, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { SignupCustomerDTO } from './dto/signup-customer.dto';
import { Request } from 'express';
import { CustomerService } from './customer.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ReferMerchantDTO } from './dto/refer-merchant.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('signup')
  async signupCustomer(
    @Body(new ValidationPipe()) body: SignupCustomerDTO,
  ) {
    try {
      return await this.customerService.create(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refer')
  @UseGuards(AccessTokenGuard)
  async referMerchant(@Req() req: Request, @Body(new ValidationPipe()) body: ReferMerchantDTO) {
    try {
      const customerId = req.user?.['sub'];
      if (!customerId) throw new UnauthorizedException()
      return await this.customerService.createMerchantRefer({ ...body, referrerCustomerId: customerId})
    }
    catch (e) {
      return e
    }
  }
}
