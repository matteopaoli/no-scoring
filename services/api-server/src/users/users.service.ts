import { Injectable } from '@nestjs/common';
import { or, ilike, eq } from 'drizzle-orm';
import { db, users } from '@paytomorrow/db';
import { UpdateUserDto } from 'src/users/dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor() {}

  async findByEmail(email: string): Promise<any> {
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async findByInviteCode(inviteCode: string) {
    try {
      const result = await db
        .select({
          id: users.id,
          password: users.password,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          role: users.role,
          onboardingLink: users.onboardingLink
        })
        .from(users)
        .where(eq(users.inviteCode, inviteCode));
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }

  async searchUsers(searchQuery: string): Promise<any> {
    console.log(searchQuery)
    try {
      return await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        })
        .from(users)
        .where(
          or(
            ilike(users.firstName, `%${searchQuery}%`),
            ilike(users.lastName, `%${searchQuery}%`),
            ilike(users.email, `%${searchQuery}%`),
          ),
        );
    } catch (error) {
      throw new Error('Error executing search query');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await db.update(users).set(updateUserDto).where(eq(users.id, id));
  }
}
