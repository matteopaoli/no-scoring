import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AcceptTosDto } from './dto/AcceptTosDTO';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';
import { TosService } from './tos.service';

@Controller('tos')
@UseGuards(AccessTokenGuard)
export class TosController {
  constructor(private readonly toS: TosService) {}
  @Post('accept')
  async acceptTos(@Body() dto: AcceptTosDto, @Req() req: Request) {
    const userId = req.user?.['sub'];
    await this.toS.acceptTos(userId!);
    return { message: 'Terms of Service accepted' };
  }
}
