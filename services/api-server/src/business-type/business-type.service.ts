import { Injectable } from '@nestjs/common';
import { businessType, db } from '@paytomorrow/db';
@Injectable()
export class BusinessTypeService {
  async getBusinessTypes() {
    return await db.select().from(businessType);
  }
}
