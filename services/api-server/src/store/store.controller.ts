// store.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // GET /store/nearby?lat=...&lng=...&radius=...
  @Get('nearby')
  async getNearbyStores(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = radius ? parseFloat(radius) : 5000;
    const parsedLimit = Math.min(parseInt(limit || '10', 10), 50); // max limit 50
    const parsedOffset = parseInt(offset || '0', 10);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates');
    }

    return this.storeService.findNearbyStores(
      latitude,
      longitude,
      radiusInMeters,
      parsedLimit,
      parsedOffset,
    );
  }

  // GET /store/:id
  @Get(':id')
  async getStoreDetails(@Param('id') id: string) {
    return this.storeService.getStoreDetailsById(id);
  }
}
