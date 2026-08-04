import { Module } from '@nestjs/common';
import { CoverageController } from './coverage.controller';
import { CoverageService } from './coverage.service';
import { CoverageAggregatorService } from './coverage-aggregator.service';
import { InternalCoverageAdapter } from './adapters/internal-coverage.adapter';
import { TelkomOpenserveAdapter } from './adapters/telkom-openserve.adapter';
import { EvotelAdapter } from './adapters/evotel.adapter';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CoverageController],
  providers: [
    CoverageService,
    CoverageAggregatorService,
    InternalCoverageAdapter,
    TelkomOpenserveAdapter,
    EvotelAdapter,
  ],
})
export class CoverageModule {}
