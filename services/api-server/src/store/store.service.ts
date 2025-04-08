// store.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  stores,
  userStoreRoles,
  subscriptions,
  db,
  users,
} from '@paytomorrow/db';
import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StoreService {
  constructor(private usersService: UsersService) {}

  async createStoreWithUserRole(createStoreDto: {
    name: string;
    description: string;
    image?: string;
    placeId: string;
    locationLat: string;
    locationLng: string;
    customerPaysFees: boolean;
    partnerId: string;
    userId: string;
  }) {
    return db.transaction(async (tx) => {
      // Correct the issue by ensuring that we're passing the correct structure to `values()`
      const [newStore] = await tx
        .insert(stores)
        .values({
          name: createStoreDto.name as string, // Ensure name is typed correctly
          description: createStoreDto.description as string, // Ensure description is a string
          image: createStoreDto.image || null, // Optional field
          partnerId: createStoreDto.partnerId || null, // Optional field
          location: sql`ST_SetSRID(ST_MakePoint(${parseFloat(createStoreDto.locationLng)}, ${parseFloat(createStoreDto.locationLat)}), 4326)`, // Geometry expression
          geodata: {
            lng: parseFloat(createStoreDto.locationLng),
            lat: parseFloat(createStoreDto.locationLat),
            placeId: createStoreDto.placeId,
          },
          customerPaysFees: createStoreDto.customerPaysFees, // Required field
        })
        .returning();

      // Assign admin role to the user for this store
      await tx.insert(userStoreRoles).values({
        userId: createStoreDto.userId,
        storeId: newStore.id,
        role: 'admin',
      });

      // Create an initial subscription for the store
      await tx.insert(subscriptions).values({
        storeId: newStore.id,
      });

      return newStore;
    });
  }

  async getAdminStripeUserIdByUserId(userId: string) {
    // First, find the store associated with the given user
    const store = await db
      .select({
        id: stores.id,
      })
      .from(stores)
      .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
      .where(eq(userStoreRoles.userId, userId))
      .limit(1);

    if (!store[0]) throw new Error('Store not found');

    // Then, find the admin user of that store and return their stripeUserId
    const result = await db
      .select({
        stripeUserId: users.stripeUserId,
      })
      .from(users)
      .innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id))
      .where(
        and(
          eq(userStoreRoles.storeId, store[0].id),
          eq(userStoreRoles.role, 'admin'),
        ),
      )
      .limit(1);

    return result[0]?.stripeUserId || null;
  }

  async getAdminStripeUserIdByStoreId(storeId: string) {
    const result = await db
      .select({
        stripeUserId: users.stripeUserId,
      })
      .from(users)
      .innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id))
      .where(
        and(
          eq(userStoreRoles.storeId, storeId),
          eq(userStoreRoles.role, 'admin'),
        ),
      )
      .limit(1);

    return result[0]?.stripeUserId || null;
  }

  async getStoreByUserId(userId: string) {
    const result = await db
      .select({
        id: stores.id,
        name: stores.name,
        partnerId: stores.partnerId,
        customerPaysFees: stores.customerPaysFees,
      })
      .from(stores)
      .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
      .where(eq(userStoreRoles.userId, userId));
    return result[0] || null;
  }

  async findNearbyStores(
    lat: number,
    lng: number,
    radius: number = 5000,
    limit: number = 10,
    offset: number = 0,
  ) {
    const result = await db.execute(
      sql`
      SELECT *
      FROM ${stores}
      WHERE ST_DWithin(
        ${stores.location},
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radius}
      )
      LIMIT ${limit}
      OFFSET ${offset}
    `,
    );

    return result;
  }

  async getStoreDetailsById(storeId: string) {
    const result = await db
      .select({
        ...getTableColumns(stores),
        stripeUserId: sql`(
          SELECT ${users.stripeUserId}
          FROM ${userStoreRoles}
          INNER JOIN ${users} ON ${eq(userStoreRoles.userId, users.id)}
          WHERE ${eq(userStoreRoles.storeId, stores.id)} 
            AND ${eq(userStoreRoles.role, 'admin')}
          LIMIT 1
        )`.as('stripeUserId') // Alias the subquery result
      })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);
  
    if (!result.length) {
      throw new NotFoundException('Store not found');
    }
  
    return result[0];
  }
}
