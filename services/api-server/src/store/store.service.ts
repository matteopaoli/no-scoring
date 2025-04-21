// store.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  stores,
  userStoreRoles,
  subscriptions,
  db,
  users,
  products,
  sales,
  businessType,
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

  async getAdminUserByStoreId(storeId: string) {
    const result = await db
      .select()
      .from(users)
      .innerJoin(userStoreRoles, eq(userStoreRoles.userId, users.id))
      .where(
        and(
          eq(userStoreRoles.storeId, storeId),
          eq(userStoreRoles.role, 'admin'),
        ),
      )
      .limit(1);
  
    return result[0] || null;
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

  async getDetailedStoreInfoByUserId(userId: string) {
    const store = await db
      .select({
        id: stores.id,
        name: stores.name,
        partnerId: stores.partnerId,
        address: stores.address,
        image: stores.image,
        customerPaysFees: stores.customerPaysFees,
      })
      .from(stores)
      .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
      .where(eq(userStoreRoles.userId, userId))
      .then(res => res[0]);

    if (!store) return null;
  
    // Fetch more detailed store data
    const [salesCountResult, revenueResult] = await Promise.all([
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sales)
        .where(eq(sales.storeId, store.id)),
  
      db
        .select({ totalRevenue: sql<number>`SUM(${sales.amount})` })
        .from(sales)
        .where(eq(sales.storeId, store.id)),
    ]);
  
    return {
      ...store,
      salesCount: Number(salesCountResult[0]?.count) || 0,
      totalRevenue: Number(revenueResult[0]?.totalRevenue) || 0,
    };
  }
  
  async findNearbyStores(
    lat: number,
    lng: number,
    limit: number = 10,
    offset: number = 0,
    radius?: number,
  ) {
    // Create the point with SRID and cast to geography
    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;
    // Optional WHERE clause
    const whereClause = radius !== undefined
      ? sql`ST_DWithin(${stores.location}::geography, ${sqlPoint}, ${radius})`
      : undefined;
  
    const query = db
      .select({
        ...getTableColumns(stores),
        distance: sql`ST_Distance(${stores.location}::geography, ${sqlPoint})`,
      })
      .from(stores)
      .where(whereClause)
      .orderBy(sql`${stores.location} <-> ${sqlPoint}`) // spatial index sort
      .limit(limit)
      .offset(offset)
  
    const result = await query;
    return result;
  }

  async getStoreDetailsById(storeId: string) {
    const result = await db
      .select({
        ...getTableColumns(stores),
        category: businessType.name,
        stripeUserId: sql`(
          SELECT ${users.stripeUserId}
          FROM ${userStoreRoles}
          INNER JOIN ${users} ON ${eq(userStoreRoles.userId, users.id)}
          WHERE ${eq(userStoreRoles.storeId, stores.id)} 
            AND ${eq(userStoreRoles.role, 'admin')}
          LIMIT 1
        )`.as('stripeUserId'), // Alias the subquery result
      })
      .from(stores)
      .innerJoin(userStoreRoles, eq(stores.id, userStoreRoles.storeId))
      .innerJoin(users, eq(users.id, userStoreRoles.userId))
      .innerJoin(businessType, eq(businessType.id, users.businessTypeId))
      .where(and(eq(stores.id, storeId), eq(userStoreRoles.role, 'admin')))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException('Store not found');
    }

    return result[0];
  }

  async searchStoresNearby(
    query: string = '',
    lat: number,
    lng: number,
    limit: number = 10,
    offset: number = 0,
    categoryId?: number,
    radiusInMeters?: number,
  ) {
    console.log(radiusInMeters)
    const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;
    
    // Ensure query is always a string (even if it's empty)
    const q = query ? `%${query.toLowerCase()}%` : '%';  // Default to searching everything if query is empty
    
    // Base WHERE conditions
    const whereConditions = [
      sql`LOWER(${stores.name}) ILIKE ${q}`,
      eq(userStoreRoles.role, 'admin'),
      ...(categoryId ? [eq(users.businessTypeId, categoryId)] : [])
    ];
    
    // Optional radius filter
    if (radiusInMeters !== undefined) {
      whereConditions.push(
        sql`ST_DWithin(${stores.location}::geography, ${sqlPoint}, ${radiusInMeters})`
      );
    }

    const sqlquery = db
    .select({
      ...getTableColumns(stores),
      distance: sql`ST_Distance(${stores.location}::geography, ${sqlPoint})`,
    })
    .from(stores)
    .innerJoin(userStoreRoles, eq(userStoreRoles.storeId, stores.id))
    .leftJoin(users, eq(users.id, userStoreRoles.userId))
    .where(and(...whereConditions))
    .orderBy(sql`${stores.location} <-> ${sqlPoint}`)
    .limit(limit)
    .offset(offset);
   
    console.log(sqlquery.toSQL())

    const result = await sqlquery
  
    return result;
  }
  
  
}
