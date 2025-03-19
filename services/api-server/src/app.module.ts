import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],  // Add AuthModule to imports array
  controllers: [],
  providers: [],
})
export class AppModule {}
