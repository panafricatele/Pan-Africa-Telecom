import { Injectable } from '@nestjs/common';
import { CoverageAggregatorService } from './coverage-aggregator.service';
import { CoverageResult } from './coverage.types';

@Injectable()
export class CoverageService {
  constructor(private readonly aggregator: CoverageAggregatorService) {}

  check(location: string): Promise<CoverageResult> {
    return this.aggregator.check(location);
  }
}
