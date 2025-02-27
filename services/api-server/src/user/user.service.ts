import { Injectable } from '@nestjs/common';
import { db, regions, users } from '@paytomorrow/db';
import { getTableColumns, eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  async findByEmail(email: string) {
    return (
      await db
        .select({ ...getTableColumns(users), regionName: regions.name })
        .from(users)
        .where(eq(users.email, email ?? ""))
        .leftJoin(regions, eq(users.regionId, regions.id))
    )?.[0];
  }

  async generatePasswordResetToken(user) {
    
  }

  async sendPasswordResetEmail(user, token: string) {
  }

  async verifyResetToken(token: string) {
  }
  
  async updatePassword(userId: number, newPassword: string) {

  }
}
