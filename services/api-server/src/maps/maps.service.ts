import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async autocomplete(input: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    const response = await firstValueFrom(
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
}