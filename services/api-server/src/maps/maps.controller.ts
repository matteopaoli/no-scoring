import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('autocomplete')
  async autocomplete(@Query('input') input: string) {
    if (!input) {
      throw new Error('Input parameter is required');
    }
    return this.mapsService.autocomplete(input);
  }

  @Get('place-details')
  async getPlaceDetails(@Query('placeId') placeId: string) {
    if (!placeId) {
      throw new Error('placeId parameter is required');
    }
    return this.mapsService.getPlaceDetails(placeId);
  }
}
