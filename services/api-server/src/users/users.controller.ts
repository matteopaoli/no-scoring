import { Controller, Get, Query, UseGuards, Request, ValidationPipe, Body, Post, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { GetUserByInviteCodeDTO } from './dto/getUserByInviteCode.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('search')
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

  @Post('get-by-invite')
  @HttpCode(200) 
  async getUserByInviteCode(
    @Body(new ValidationPipe()) body: GetUserByInviteCodeDTO
  ) {
    try {
      const user = await this.usersService.findByInviteCode(body.inviteCode);
      return { user };
    } catch (error) {
      return { message: error.message };
    }
  }
}
