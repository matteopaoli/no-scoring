import { Controller, Get, UseGuards } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('geolocation')
export class GeolocationController {
    constructor(private readonly geolocationService: GeolocationService) { }

    @Get('regions')
    @UseGuards(AccessTokenGuard)
    async getRegions() {
        return this.geolocationService.getRegions()
    }
}
