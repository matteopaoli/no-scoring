import { Injectable } from '@nestjs/common';
import { areas, db, regions, stores, users, userStoreRoles } from '../db';
import { and, eq, inArray } from 'drizzle-orm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PartnerService {
  constructor(private usersService: UserService) {}

  async getPartnerNetwork(userId: string) {
    const user = await this.usersService.findById(userId);
    if (user.role === 'admin') {
      return db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.role, ['partner', 'subpartner']))
        .then((res) => res.map((x) => x.id));
    }

    const partnerNetwork: string[] = [];

    const findPartners = async (partnerId: string) => {
      const affiliatedUsers = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.partnerId, partnerId));

      for (const affiliatedUser of affiliatedUsers) {
        if (
          affiliatedUser.role === 'partner' ||
          affiliatedUser.role === 'subpartner'
        ) {
          partnerNetwork.push(affiliatedUser.id);
          await findPartners(affiliatedUser.id);
        }
      }
    };

    await findPartners(userId);

    return [...new Set(partnerNetwork)]; // Return unique list of partner userIds
  }

  async getMerchantsNetwork(partnerId: string) {
    const user = await this.usersService.findById(partnerId);
    if (user.role === 'admin') {
      return await db
        .select({ id: users.id })
        .from(users)
        .then((res) => res.map((x) => x.id));
    }
    const merchantsPartnerNetwork = [
      ...new Set(
        await db
          .select({ id: users.id })
          .from(users)
          .where(
            and(
              inArray(users.partnerId, [
                ...(await this.getPartnerNetwork(partnerId)),
                partnerId,
              ]),
              eq(users.role, 'user'),
            ),
          )
          .then((res) => res.map((x) => x.id)),
      ),
    ];
    if (['partner', 'subpartner'].includes(user.role)) {
      return merchantsPartnerNetwork;
    }
    if (user.role === 'areamanager') {
      const areaId = await db
        .select({ id: areas.id })
        .from(areas)
        .where(eq(areas.managerId, partnerId))
        .then((res) => res[0]?.id);

      if (!areaId) {
        throw new Error('Unauthorized: Area manager not found.');
      }
      const regionIds = (
        await db
          .select({ id: regions.id })
          .from(regions)
          .where(eq(regions.areaId, areaId))
      ).map((region) => region.id);

      const regionMerchants = (
        await db
          .select({ id: users.id })
          .from(users)
          .where(inArray(users.regionId, regionIds))
      ).map((user) => user.id);
      return [...new Set([...regionMerchants, ...merchantsPartnerNetwork])];
    }
    return [];
  }

  async getStoresNetwork(partnerId: string) {
    const user = await this.usersService.findById(partnerId);
    if (user.role === 'admin') {
      return db
        .select({ id: stores.id })
        .from(stores)
        .then((res) => res.map((x) => x.id));
    }

    return db
      .select({ id: stores.id })
      .from(stores)
      .leftJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
      .leftJoin(users, eq(users.id, userStoreRoles.userId))
      .where(
        inArray(users.id, await this.getMerchantsNetwork(partnerId)),
      )
      .then((res) => res.map((x) => x.id));
  }
}
