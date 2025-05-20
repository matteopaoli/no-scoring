import { Injectable } from '@nestjs/common';
import { or, ilike, eq, and, inArray } from 'drizzle-orm';
import { db, users, userStoreRoles, products, stores } from '@paytomorrow/db';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';
import { ReferMerchantDTO } from 'src/customer/dto/refer-merchant.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) { }

  async findByEmail(email: string) {
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async findById(id: string) {
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
          onboardingCompleted: users.onboardingCompleted,
          partnerId: users.partnerId,
        })
        .from(users)
        .where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async findByInviteCode(inviteCode: string) {
    if (!inviteCode) return null;
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
          onboardingLink: users.onboardingLink,
        })
        .from(users)
        .where(eq(users.inviteCode, inviteCode));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async searchUsers(searchQuery: string): Promise<any> {
    try {
      return await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        })
        .from(users)
        .where(
          or(
            ilike(users.firstName, `%${searchQuery}%`),
            ilike(users.lastName, `%${searchQuery}%`),
            ilike(users.email, `%${searchQuery}%`),
          ),
        );
    } catch (error) {
      throw new Error('Error executing search query');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await db.update(users).set(updateUserDto).where(eq(users.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(userStoreRoles).where(eq(userStoreRoles.userId, id));

    const userStores = await db
      .select()
      .from(userStoreRoles)
      .where(
        and(eq(userStoreRoles.userId, id), eq(userStoreRoles.role, 'admin')),
      );

    const storeIds = userStores.map((storeRole) => storeRole.storeId);

    if (storeIds.length > 0) {
      await db
        .delete(userStoreRoles)
        .where(inArray(userStoreRoles.storeId, storeIds));
      await db.delete(stores).where(inArray(stores.id, storeIds));
    }

    await db.delete(products).where(eq(products.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  private getDefaultPassword() {
    const salt = genSaltSync(10);
    const hash = hashSync("PayTomorrow!2024", salt);
    return hash;
  }

  private async generateInviteCode(): Promise<string> {
    const CODE_LENGTH = 5;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    let code = '';

    for (let i = 0; i < CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const existingCode = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.inviteCode, code));

    if (existingCode.length === 0) {
      return code;
    }

    return this.generateInviteCode();
  }

  async createMerchant(merchantData: CreateMerchantDTO) {
    const hash = this.getDefaultPassword();
    const inviteCode = await this.generateInviteCode();

    const stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY')!);

    const merchantAccount = await stripe.accounts.create({
      country: "IT",
      email: merchantData.email,
      controller: {
        fees: {
          payer: "account",
        },
        losses: {
          payments: "stripe",
        },
        stripe_dashboard: {
          type: "full",
        },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: merchantAccount.id,
      refresh_url: `${process.env.WEB_DOMAIN}/api/stripe/refresh-url?accountId=${merchantAccount.id}`,
      return_url: `${process.env.WEB_DOMAIN}/login`,
      type: "account_onboarding",
    });

    if (!accountLink.url) {
      throw new Error("Could not create account link");
    }

    const [newMerchant] = await db.insert(users).values({
      email: merchantData.email,
      role: "user",
      businessTypeId: merchantData.businessTypeId,
      businessName: merchantData.refName,
      onboardingLink: accountLink.url,
      status: "pending",
      stripeUserId: merchantAccount.id,
      partnerId: merchantData.partnerId,
      phoneNumber: merchantData.phoneNumber,
      refName: merchantData.refName,
      password: hash,
      regionId: merchantData.regionId,
      inviteCode,
      notes: merchantData.notes
    }).returning();

    console.log('newMerchant', newMerchant)
    return newMerchant
  }
}
