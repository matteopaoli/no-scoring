import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  // Handles the request for a password reset
  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;

    // Check if the user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate a reset token and send an email (or link) to the user
    const resetToken = await this.usersService.generatePasswordResetToken(user);
    await this.usersService.sendPasswordResetEmail(user, resetToken);

    return { message: 'Password reset link has been sent to the provided email' };
  }

  // Handles resetting the password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Verify the reset token
    const user = await this.usersService.verifyResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Update the user's password
    await this.usersService.updatePassword(user.id, newPassword);

    return { message: 'Password has been successfully reset' };
  }
}
