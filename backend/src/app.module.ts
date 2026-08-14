import { Module } from '@nestjs/common';
import { CoverageModule } from './coverage/coverage.module';
import { ServicesModule } from './services/services.module';
import { LeadModule } from './leads/lead.module';
import { TicketsModule } from './tickets/tickets.module';
import { PhonesModule } from './phones/phones.module';
import { CheckoutModule } from './checkout/checkout.module';
import { DatabaseModule } from './database/database.module';
import { NetworkStatusModule } from './network-status/network-status.module';

@Module({
  imports: [DatabaseModule, CoverageModule, ServicesModule, LeadModule, TicketsModule, PhonesModule, CheckoutModule, NetworkStatusModule],
})
export class AppModule {}
