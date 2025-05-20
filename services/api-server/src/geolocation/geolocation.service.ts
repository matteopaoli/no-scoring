import { Injectable } from '@nestjs/common';
import { db, regions } from '@paytomorrow/db';

@Injectable()
export class GeolocationService {
    async getRegions() {
        return await db.select().from(regions)
    }
}
