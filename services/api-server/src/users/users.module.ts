import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StoreService } from 'src/store/store.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, StoreService],
  exports: [UsersService]
})
export class UsersModule {}
