// import modules
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { db, users } from '@paytomorrow/db';
import { eq } from 'drizzle-orm';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MessagingService {
  constructor(private readonly httpService: HttpService) { }

  async getAdminEmailAddresses() {
    return (await db.select({ email: users.email }).from(users).where(eq(users.role, 'admin'))).map(user => user.email)
  }

  async sendEmail(payload: {
    template_name: string;
    data: Record<string, any>;
  }) {
    try {
      await firstValueFrom(
        this.httpService.post('http://localhost:6000/send-email', payload),
      );
    } catch (error) {
      console.error('Failed to send email:', error?.response?.data || error.message);
    }
  }
}
