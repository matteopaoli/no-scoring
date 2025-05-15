import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
  Body,
  Post,
  HttpCode,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { GetUserByInviteCodeDTO } from './dto/getUserByInviteCode.dto';
import { Request } from 'express';
import { SetupProfileDTO } from './dto/setupProfile.dto';
import { StoreService } from 'src/store/store.service';
import { genSaltSync, hashSync } from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storeService: StoreService,
  ) {}

  @Roles('admin')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('search')
  async searchUsers(@Query('q') searchQuery: string) {
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
    @Body(new ValidationPipe()) body: GetUserByInviteCodeDTO,
  ) {
    try {
      const user = await this.usersService.findByInviteCode(body.inviteCode);
      return { user };
    } catch (error) {
      return { message: error.message };
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    try {
      const userId = req.user?.['sub'];
      const user = await this.usersService.findById(userId!);
      return { user };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { message: error.message };
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('setup-profile')
  async setupProfile(
    @Req() req: Request,
    @Body(new ValidationPipe()) body: SetupProfileDTO,
  ) {
    try {
      const userId = req.user?.['sub'];

      const hash = hashSync(body.password, genSaltSync(10));

      // 1. Update user profile
      await this.usersService.update(userId!, {
        firstName: body.firstName,
        lastName: body.lastName,
        password: hash,
        image: body.profileImage,
        onboardingCompleted: true,
        inviteCode: null,
        tosAccepted: true,
        tosAcceptedAt: new Date(),
      });

      const user = await this.usersService.findById(userId!);

      const store = await this.storeService.createStoreWithUserRole({
        name: body.storeName,
        description: body.storeDescription,
        image: body.storeImage,
        placeId: body.storePlaceId,
        locationLat: body.storeLocationLat,
        locationLng: body.storeLocationLng,
        customerPaysFees: body.customerPaysFees,
        partnerId: user.partnerId,
        userId: userId!,
      });

      return { user, store };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('delete')
  async deleteUser(@Req() req: Request) {
    try {
      const userId = req.user?.['sub'];
      if (userId) {
        await this.usersService.delete(userId);
        return { message: 'User deleted successfully' };
      } else throw new Error('');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
