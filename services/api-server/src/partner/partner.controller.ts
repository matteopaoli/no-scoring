import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/roles.enum';

@Controller('partners')
@UseGuards(RolesGuard) // Apply the guard to the entire controller
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get(':userId/network')
  @Roles(Role.Admin, Role.Partner, Role.AreaManager, Role.Subpartner)
  async getPartnerNetwork(@Param('userId') userId: string) {
    return this.partnerService.getPartnerNetwork(userId);
  }

  @Get(':partnerId/merchants-network')
  @Roles(Role.Partner, Role.Subpartner, Role.AreaManager, Role.Admin)
  async getMerchantsNetwork(@Param('partnerId') partnerId: string) {
    return this.partnerService.getMerchantsNetwork(partnerId);
  }

  @Get(':partnerId/stores-network')
  @Roles(Role.Partner, Role.AreaManager, Role.Subpartner, Role.Admin)
  async getStoresNetwork(@Param('partnerId') partnerId: string) {
    return this.partnerService.getStoresNetwork(partnerId);
  }
}
