import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { StoreService } from 'src/store/store.service';

type ExternalRequest = Request & {
    storeId?: string
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExternalRequest>();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) return false;

    const storeId = await this.storeService.findByApiKey(apiKey);
    if (!storeId) return false;

    const store = await this.storeService.getStoreDetailsById(storeId)

    if (!store.isSubscriptionActive) {
        return false
    }

    // Attach user info to request
    request.storeId = storeId
    return true;
  }
}
