// store.controller.ts
import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Request } from 'express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

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

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('user')
  @Get('me')
  async getMyStoreInfo(@Req() req: Request) {
    const userId = req.user?.['sub'];
    console.log('userid', userId)
    const store = await this.storeService.getDetailedStoreInfoByUserId(userId);

    console.log("result", store)
    return store
  }

    // GET /store/:id
    @Get(':id')
    async getStoreDetails(@Param('id') id: string) {
      return this.storeService.getStoreDetailsById(id);
    }
  
}
