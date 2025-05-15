import { Body, Controller, HttpException, HttpStatus, Post, Req, ValidationPipe } from '@nestjs/common';
import { SignupCustomerDTO } from './dto/signup-customer.dto';
import { Request } from 'express';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signup')
  async signupCustomer(
    @Req() req: Request,
    @Body(new ValidationPipe()) body: SignupCustomerDTO,
  ) {
    try {
      // await this.customerService.create(body);

      // return { user, store };
      return true;
    } catch (error) {
      // eslint-disable-next-line
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
