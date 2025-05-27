import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupCustomerDTO } from './dto/signup-customer.dto';
import { hashSync } from 'bcryptjs';
import { db, users } from '@paytomorrow/db';
import { ReferMerchantDTO } from './dto/refer-merchant.dto';
import { BusinessTypeService } from 'src/business-type/business-type.service';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { UsersService } from 'src/users/users.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class CustomerService {
  constructor(
    private readonly businessTypeService: BusinessTypeService,
    private readonly geolocationService: GeolocationService,
    private readonly userService: UsersService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(userData: SignupCustomerDTO) {
    try {
      const hash = hashSync(userData.password, 10);

      const customer = await db
        .insert(users)
        .values({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: hash,
          phoneNumber: userData.phoneNumber,
          status: 'active',
          role: 'customer',
          tosAccepted: true,
          tosAcceptedAt: new Date(),
        })
        .returning();

      return customer;
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async createMerchantRefer(
    merchantData: ReferMerchantDTO & { referrerCustomerId: string },
  ) {
    const [businessTypeIds, regionIds, existingUser] = await Promise.all([
      this.businessTypeService
        .getBusinessTypes()
        .then((res) => res.map((b) => b.id)),
      this.geolocationService.getRegions().then((res) => res.map((x) => x.id)),
      this.userService.findByEmail(merchantData.email),
    ]);

    if (!businessTypeIds.includes(merchantData.businessTypeId)) {
      throw new BadRequestException();
    }

    if (!regionIds.includes(merchantData.regionId)) {
      throw new BadRequestException();
    }

    if (existingUser) {
      throw new BadRequestException({
        message: 'User already exists',
        code: 'USER_EXISTS',
      });
    }

    const customer = await this.userService.findById(
      merchantData.referrerCustomerId,
    );

    const merchant = await this.userService.createMerchant({
      email: merchantData.email,
      businessTypeId: merchantData.businessTypeId,
      businessName: merchantData.refName,
      referrerCustomerId: merchantData.referrerCustomerId,
      refName: merchantData.refName,
      phoneNumber: merchantData.phoneNumber,
      regionId: merchantData.regionId,
      notes: `CREATO DA CUSTOMER ${customer.firstName} ${customer.lastName} - ${customer.email} ${customer.id} \n\n ${merchantData.notes}`,
    });

    this.messagingService.sendEmail({
      template_name: 'accountCreatedMerchantWithCustomerReferral',
      data: {
        to: [merchantData.email],
        onboardingLink: merchant.onboardingLink,
        inviteCode: merchant.inviteCode,
        customerName: `${customer.firstName} ${customer.lastName}`,
      },
    });

    this.messagingService.sendEmail({
      template_name: 'newMerchantAdmin',
      data: {
        to: await this.messagingService.getAdminEmailAddresses(),
        merchantEmail: merchant.email,
        partnerName: `${customer.firstName} ${customer.lastName} (CUSTOMER)`,
      },
    });

    return { status: 'success' };
  }

  async getReferredLeads(customerId: string) {
    return await db
      .select({
        refName: users.refName,
        leadStatus: users.leadStatus,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.referrerCustomerId, customerId));
  }
}
