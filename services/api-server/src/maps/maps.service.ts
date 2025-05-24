import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { db, stores } from '@paytomorrow/db';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { AxiosResponse } from 'axios';

@Injectable()
export class MapsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async autocomplete(input: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(url, {
        params: {
          input,
          key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
          language: 'it', // Italian results
          components: 'country:it', // Restrict to Italy
        },
      }),
    );
    return response.data;
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        params: {
          place_id: placeId,
          key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
          language: 'it',
        },
      }),
    );
    return response.data;
  }

  async getMarkersInBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
    limit = 1000,
  ): Promise<any[]> {
    const query = db
      .select({
        id: stores.id,
        name: stores.name,
        image: stores.image,
        description: stores.description,
        address: stores.address,
        latitude: sql<number>`ST_Y(${stores.location}::geometry)`,
        longitude: sql<number>`ST_X(${stores.location}::geometry)`,
        geodata: stores.geodata,
      })
      .from(stores)
      .where(
        and(
          sql`ST_Contains(
            ST_MakeEnvelope(${sql.placeholder('minLng')}, ${sql.placeholder('minLat')}, 
            ${sql.placeholder('maxLng')}, ${sql.placeholder('maxLat')}, 4326),
            ${stores.location}::geometry
          )`,
          isNotNull(stores.location),
        ),
      )
      .limit(limit)
      .prepare('get_markers_in_bounds');

    // Execute the prepared statement
    const markers = await query.execute({
      minLng,
      minLat,
      maxLng,
      maxLat,
    });
    
    return markers;
  }
}