// store.controller.ts
import { Controller, Get, Query, Param, UseGuards, Req, Body, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('search')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async searchStores(
    @Query('q') query: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('category') categoryId?: number,
    @Query('radius') radius?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const parsedLimit = Math.min(parseInt(limit || '10', 10), 50);
    const parsedOffset = parseInt(offset || '0', 10);
    const radiusInMeters = radius ? parseFloat(radius) : undefined;

    console.log(query);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates');
    }

    const isSearch = !!query || !!categoryId;

    if (isSearch) {
      return this.storeService.searchStoresNearby(
        query,
        latitude,
        longitude,
        parsedLimit,
        parsedOffset,
        categoryId,
        radiusInMeters,
      );
    }

    // If no query/category → behave like the old getNearbyStores
    return this.storeService.findNearbyStores(
      latitude,
      longitude,
      parsedLimit,
      parsedOffset,
      radiusInMeters,
    );
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('user')
  @Get('me')
  async getMyStoreInfo(@Req() req: Request) {
    const userId = req.user?.['sub'];
    const store = await this.storeService.getDetailedStoreInfoByUserId(userId);
    return store;
  }

  // GET /store/:id
  @Get(':id')
  async getStoreDetails(@Param('id') id: string) {
    return this.storeService.getStoreDetailsById(id);
  }

  @UseGuards(AccessTokenGuard, RoleGuard)
  @Roles('user')
  @Post('/:id/set-fees')
  async setStoreFees(
    @Param('id') id: string,
    @Body() body: { customerPaysFees: boolean; },
  ) {
    return this.storeService.setStoreFees(id, body.customerPaysFees);
  }
}
