import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';

@Controller('search')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('users')
  async searchUsers(
    @Query('q') searchQuery: string,
  ) {
    try {
      const results = await this.usersService.searchUsers(searchQuery);
      return { results };
    } catch (error) {
      return { message: error.message };
    }
  }
}
