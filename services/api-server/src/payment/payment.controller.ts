// src/payment/payment.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StoreService } from '../store/store.service';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly storesService: StoreService,
  ) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  async createPayment(
    @Body('price') price: number,
    @Req() req: Request,
  ) {
    const userId = req.user?.['sub'];
    const stripeUserId =
      await this.storesService.getAdminStripeUserIdByUserId(userId);
    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }
    const store = await this.storesService.getStoreByUserId(userId);
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
    const stripeUserId = await this.storesService.getAdminStripeUserIdByStoreId(storeId);
    const store = await this.storesService.getStoreDetailsById(storeId);
    const finalPrice = store.customerPaysFees ? this.paymentService.getAmountWithFees(price) : price;
    if (!store) {
      throw new Error('Store not found.');
    }
    if (!stripeUserId) {
      throw new Error('Stripe user ID not found for the store.');
    }
    return this.paymentService.createPaymentIntent(
      finalPrice,
      stripeUserId,
    );
  }
}
