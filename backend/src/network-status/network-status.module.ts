import { Module } from '@nestjs/common';
import { NetworkStatusController } from './network-status.controller';
import { NetworkStatusService } from './network-status.service';

@Module({
  controllers: [NetworkStatusController],
  providers: [NetworkStatusService],
})
export class NetworkStatusModule {}
