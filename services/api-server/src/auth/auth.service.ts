// src/auth/auth.service.ts
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { compare, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

	async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user);
    return tokens;
  }

  hashData(data: string) {
    return hashSync(data, genSaltSync(10));
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshAccessToken(userId: string,) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User does not exist');
    const tokens = await this.getAccessToken({ id: user.id, email: user.email, role: user.role });
    return tokens;
  }

  async getAccessToken(user: { id: string; email: string; role: string }) {  
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async getTokens(user: { id: string; email: string; role: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(user),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
