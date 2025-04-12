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
    @Query('radius') radius?: string,  // No default value here
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = radius ? parseFloat(radius) : undefined; // No radius by default
    const parsedLimit = Math.min(parseInt(limit || '10', 10), 50); // max limit 50
    const parsedOffset = parseInt(offset || '0', 10);
  
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates');
    }
  
    return this.storeService.findNearbyStores(
      latitude,
      longitude,
      parsedLimit,
      parsedOffset,
      radiusInMeters,
    );
  }

  // GET /store/:id
  @Get(':id')
  async getStoreDetails(@Param('id') id: string) {
    return this.storeService.getStoreDetailsById(id);
  }

  @Get('search')
async searchStores(
  @Query('q') query: string,
  @Query('lat') lat: string,
  @Query('lng') lng: string,
  @Query('limit') limit?: string,
  @Query('offset') offset?: string,
) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const parsedLimit = Math.min(parseInt(limit || '10', 10), 50);
  const parsedOffset = parseInt(offset || '0', 10);

  if (!query || isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid query or coordinates');
  }

  return this.storeService.searchStoresNearby(
    query,
    latitude,
    longitude,
    parsedLimit,
    parsedOffset
  );
}
}
