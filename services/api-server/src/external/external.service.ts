import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { StoreService } from '../store/store.service';
import { CreatePaymentDTO } from './dto/createPayment.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly storesService: StoreService,
    private readonly configService: ConfigService,
  ) {}

  async createPayment(body: CreatePaymentDTO, storeId: string) {
    const store = await this.storesService.getStoreDetailsById(storeId);
    if (!store) throw new Error('Store not found');

    const storeAdmin = await this.storesService.getAdminUserByStoreId(store.id);

    if (!storeAdmin.user.stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }

    const result = await this.paymentService.createInstantPayment(
      body.price,
      storeAdmin.user.id,
      store.customerPaysFees,
      storeAdmin.user.stripeUserId,
    );

    return {
      qrCode: result.qrcode,
      paymentLink: result.paymentLink,
    };
  }

  async listCheckoutSessions(
    storeId: string,
    params?: Stripe.Checkout.SessionListParams,
  ): Promise<Stripe.ApiList<Stripe.Checkout.Session>> {
    const storeAdmin = await this.storesService.getAdminUserByStoreId(storeId);
    if (!storeAdmin.user.stripeUserId) {
      throw new Error('Stripe user ID not found for the user.');
    }
    const stripe = new Stripe(
      this.configService.get<string>('STRIPE_API_KEY')!,
      {
        stripeAccount: storeAdmin.user.stripeUserId,
      },
    );
    return stripe.checkout.sessions.list(params);
  }
}
