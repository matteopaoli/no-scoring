import { Injectable } from '@nestjs/common';
import { db, users } from '@paytomorrow/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class TosService {
    async acceptTos(userId: string): Promise<void> {
        db
        .update(users)
        .set({ tosAccepted: true, tosAcceptedAt: new Date() })
        .where(eq(users.id, userId));
    }
}
