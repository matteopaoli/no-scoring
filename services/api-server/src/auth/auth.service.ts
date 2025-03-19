import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
// import nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService 
  ) {}

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = await this.generatePasswordResetToken(user);
    await this.sendPasswordResetEmail(user, resetToken);

    return { message: 'Password reset link has been sent to the provided email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.verifyResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    await this.usersService.updatePassword(user.id, newPassword);

    return { message: 'Password has been successfully reset' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { compare } = await import('bcrypt');
    console.log(user.password)
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async generatePasswordResetToken(user) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });

    return token;
  }

  async sendPasswordResetEmail(user, token: string) {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail', // You can replace this with your email provider
    //   auth: {
    //     user: process.env.EMAIL_USER, // Email user from .env
    //     pass: process.env.EMAIL_PASS, // Email password from .env
    //   },
    // });
  }

  async verifyResetToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findById(decoded.sub);
      return user;
    }
    catch (error) {
      return null;
    }
  }
}
