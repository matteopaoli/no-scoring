import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { ExternalService } from './external.service';
import { ApiKeyGuard } from '../common/guards/apiKey.guard';
import { CreatePaymentDTO } from './dto/createPayment.dto';
import { Request } from 'express';
import { StoreService } from 'src/store/store.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('external/payments')
export class ExternalController {
  constructor(
    private readonly externalService: ExternalService,
    private readonly storeService: StoreService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @UseGuards(ApiKeyGuard)
  async createPayment(
    @Body() body: CreatePaymentDTO,
    @Req() req: Request & { storeId: string },
  ) {
    return await this.externalService.createPayment(body, req.storeId);
  }

  @Get('checkouts')
  @UseGuards(ApiKeyGuard)
  async getCheckoutSessions(
    @Req() req: Request & { storeId: string },
    @Query('limit') limit?: number,
    @Query('payment_link') paymentLink?: string,
    @Query('starting_after') startingAfter?: string,
  ): Promise<Stripe.ApiList<Stripe.Checkout.Session>> {
    const params: Stripe.Checkout.SessionListParams = {
      limit,
      payment_link: paymentLink,
      starting_after: startingAfter,
    };
    return await this.externalService.listCheckoutSessions(req.storeId, params);
  }
}
