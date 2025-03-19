import { Injectable } from '@nestjs/common';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  async findByEmail(email: string) {
    return (
      await db
        .select()
        .from(users)
        .where(eq(users.email, email))
    )?.[0];
  }

  async findById(id: string) {
    return (
      await db
        .select()
        .from(users)
        .where(eq(users.id, id))
    )?.[0];
  }
  
  async updatePassword(userId: string, newPassword: string) {
    // @ts-ignore: Unreachable code error
    // await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
  }
}