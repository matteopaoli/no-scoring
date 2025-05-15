import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signin(@Body() data: LoginDTO) {
    return this.authService.signIn(data.email, data.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { email }: { email: string }) {
    await this.authService.handleForgotPassword(email);
  }

  /**
   * Endpoint to verify the password reset token.
   * @param body - Contains the reset token.
   * @returns Success or error message based on token validity.
   */
  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: { token: string }): Promise<any> {
    const { token } = body;

    await this.authService.verifyResetToken(token);
    return { valid: true }; 
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user?.['sub'];
    return this.authService.refreshAccessToken(userId!);
  }

  /**
   * Endpoint to change the user's password using the reset token.
   * @param body - Contains the reset token and new password.
   * @returns Success message upon successful password change.
   */
  @Post('change-password')
  async changePassword(
    @Body(new ValidationPipe()) body: ChangePasswordDto,
  ): Promise<any> {
    const { token, newPassword } = body;

    // Call the service to change the password
    await this.authService.changePassword(token, newPassword);

    return { message: 'Password successfully updated' };
  }
}
