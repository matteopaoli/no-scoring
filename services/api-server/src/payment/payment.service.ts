// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { generateQrCodeWithLogo } from '../utils/qr-code';
import { db, products } from '@paytomorrow/db';

@Injectable()
export class PaymentService {
  private readonly LEG_FEE_RATE = 0.015;
  private readonly STRIPE_FEE_VAR = 0.0499;
  private readonly STRIPE_FEE_FIXED = 0.4;
  private readonly VAT = 1.22;

  private FEES_DISCLAIMER =
    'Il prezzo è stato aumentato per includere le commissioni associate al pagamento in più rate.';

  constructor(private readonly configService: ConfigService) {}

  getAmountWithFees(amount: number) {
    const stripeFeeVarVAT = this.STRIPE_FEE_VAR * this.VAT;
    const legFeeRateVAT = this.LEG_FEE_RATE * this.VAT;
    const stripeFeeFixedVAT = this.STRIPE_FEE_FIXED * this.VAT;

    const totalFeeRateVAT = stripeFeeVarVAT + legFeeRateVAT;

    return (amount + stripeFeeFixedVAT) / (1 - totalFeeRateVAT);
  }

  async createInstantPayment(
    amount: number,
    userId,
    customerPaysFees: boolean,
    stripeUserId: string,
  ) {
    const stripe = new Stripe(
      this.configService.get<string>('STRIPE_API_KEY')!,
      {
        stripeAccount: stripeUserId,
      },
    );

    const finalAmount = customerPaysFees
      ? this.getAmountWithFees(amount)
      : amount;

    const stripeProduct = await stripe.products.create({
      name: 'Pagamento istantaneo',
      description: customerPaysFees ? this.FEES_DISCLAIMER : undefined,
      images: [],
      default_price_data: {
        currency: 'eur',
        unit_amount: Math.round(finalAmount * 100),
      },
    });

    const paymentLink = await this.createPaymentLink(stripe, stripeProduct.id);
    const qrcode = await generateQrCodeWithLogo(paymentLink.url);

    await db.insert(products).values({
      id: stripeProduct.id,
      userId,
      paymentLinkId: paymentLink.id,
      qrcode: qrcode,
      type: 'instantPayment',
    });

    return { paymentLink, qrcode };
  }

  private async createPaymentLink(stripe: Stripe, productId: string) {
    const price = (await stripe.prices.list({ product: productId })).data[0];
    const transferAmount = Math.round(
      price.unit_amount! * this.LEG_FEE_RATE * this.VAT,
    );

    return stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      application_fee_amount: transferAmount,
      payment_method_types: ['klarna'],
    });
  }

  async createPaymentIntent(
    amount: number,
    stripeUserId: string,
  ): Promise<unknown> {
    const stripe = new Stripe(
      this.configService.get<string>('STRIPE_API_KEY')!,
      {
        stripeAccount: stripeUserId,
      },
    );
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' },
    );
    const transferAmount = Math.round(amount * this.LEG_FEE_RATE * this.VAT);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      customer: customer.id,
      payment_method_types: ['klarna'],
      application_fee_amount: transferAmount,
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    }
  }
}
