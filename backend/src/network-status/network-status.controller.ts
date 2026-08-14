import { Controller, Get } from '@nestjs/common';
import { NetworkStatusService } from './network-status.service';

@Controller('api/v1/network-status')
export class NetworkStatusController {
  constructor(private readonly networkStatusService: NetworkStatusService) {}

  @Get()
  async getAll() {
    return this.networkStatusService.getNetworkStatus();
  }

  @Get('evotel-components')
  async getEvotelComponents() {
    return this.networkStatusService.getEvotelComponents();
  }
}
