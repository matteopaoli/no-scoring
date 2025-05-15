// src/auth/auth.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');
    if (!['customer', 'user'].includes(user.role)) {
      throw new BadRequestException('This user role is not supported');
    }
    const passwordMatches = await compare(password, user.password!);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user);
    return tokens;
  }

  hashData(data: string) {
    return hashSync(data, genSaltSync(10));
  }

  async refreshAccessToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User does not exist');
    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return tokens;
  }

  async getTokens(user: { id: string; email: string; role: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
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

  generateResetToken(user: any): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: '1h',
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      },
    );
  }

  async handleForgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = this.generateResetToken(user);
    await this.usersService.update(user.id, { resetToken });

    await this.mailerService.sendEmail([user.email], 'forgot-password', {
      name: user.firstName,
      resetUrl: `${this.configService.get<string>('WEB_DOMAIN')}/reset-password?token=${resetToken}`,
    });
  }

  async verifyResetToken(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }); // Your JWT secret key
      const user = await this.usersService.findById(decodedToken['sub']);
      if (!user) {
        throw new BadRequestException('Invalid token');
      }
      return decodedToken; // Token is valid
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  /**
   * Change the user's password using the reset token.
   * @param token - The reset token.
   * @param newPassword - The new password the user wants to set.
   * @returns The updated user.
   */
  async changePassword(token: string, newPassword: string): Promise<any> {
    const decodedToken = await this.verifyResetToken(token);
    const hashedPassword = this.hashData(newPassword);
    await this.usersService.update(
      decodedToken['sub'],
      { password: hashedPassword, resetToken: null },
    );

    return { message: 'Password successfully updated' };
  }
}
