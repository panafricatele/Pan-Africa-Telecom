import { Module } from '@nestjs/common';
import { CoverageController } from './coverage.controller';
import { CoverageService } from './coverage.service';
import { CoverageAggregatorService } from './coverage-aggregator.service';
import { InternalCoverageAdapter } from './adapters/internal-coverage.adapter';
import { TelkomOpenserveAdapter } from './adapters/telkom-openserve.adapter';
import { EvotelAdapter } from './adapters/evotel.adapter';
import { SupabaseCoverageAdapter } from './adapters/supabase-coverage.adapter';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CoverageController],
  providers: [
    CoverageService,
    CoverageAggregatorService,
    SupabaseCoverageAdapter,
    InternalCoverageAdapter,
    TelkomOpenserveAdapter,
    EvotelAdapter,
  ],
})
export class CoverageModule {}
