// src/payment/payment.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StoreService } from '../store/store.service';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly storesService: StoreService,
  ) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  async createPayment(@Body('price') price: number, @Req() req: Request) {
    const userId = req.user?.['sub'];
    const stripeUserId = await this.storesService.getAdminStripeUserIdByUserId(
      userId!,
    );
    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }
    const store = await this.storesService.getStoreByUserId(userId!);
    const result = await this.paymentService.createInstantPayment(
      price,
      userId,
      store.customerPaysFees,
      stripeUserId,
    );

    return { qrCode: result.qrcode, paymentLink: result.paymentLink };
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('price') price: number,
    @Body('storeId') storeId: string,
  ) {
    const stripeUserId =
      await this.storesService.getAdminStripeUserIdByStoreId(storeId);
    const store = await this.storesService.getStoreDetailsById(storeId);
    const finalPrice = store.customerPaysFees
      ? this.paymentService.getAmountWithFees(price)
      : price;
    if (!store) {
      throw new Error('Store not found.');
    }
    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the store.');
    }
    return this.paymentService.createPaymentIntent(finalPrice, stripeUserId);
  }

  @Get('sales')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('user')
  async getSales(
    @Req() req: Request,
    @Query('limit') limit = '10', // Default limit if not provided
    @Query('offset') offset = '0', // Default offset if not provided
  ) {
    const userId = req.user?.['sub'];

    const stripeUserId = await this.storesService.getAdminStripeUserIdByUserId(
      userId!,
    );
    const store = await this.storesService.getStoreByUserId(userId!);
    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }

    const parsedLimit = Math.min(parseInt(limit, 10), 100); // Cap limit to 100 to avoid excessive loads
    const parsedOffset = parseInt(offset, 10);

    const sales = await this.paymentService.getSales(
      stripeUserId,
      store.id,
      parsedLimit,
      parsedOffset,
    );
    console.log(sales);
    return sales;
  }

  @Get('sales/stats')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('user')
  async getSalesStats(@Req() req: Request) {
    const userId = req.user?.['sub'];
    const stripeUserId = await this.storesService.getAdminStripeUserIdByUserId(
      userId!,
    );
    const store = await this.storesService.getStoreByUserId(userId!);

    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }

    const stats = await this.paymentService.getSalesStats(store.id);
    return stats;
  }
}
