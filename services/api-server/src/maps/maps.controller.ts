import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('autocomplete')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async autocomplete(@Query('input') input: string) {
    if (!input) {
      throw new Error('Input parameter is required');
    }
    return this.mapsService.autocomplete(input);
  }

  @Get('place-details')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async getPlaceDetails(@Query('placeId') placeId: string) {
    if (!placeId) {
      throw new Error('placeId parameter is required');
    }
    return this.mapsService.getPlaceDetails(placeId);
  }
}
