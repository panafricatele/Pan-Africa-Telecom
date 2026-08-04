import { Injectable } from '@nestjs/common';
import { CoverageAdapter } from './adapters/coverage-adapter.interface';
import { InternalCoverageAdapter } from './adapters/internal-coverage.adapter';
import { TelkomOpenserveAdapter } from './adapters/telkom-openserve.adapter';
import { EvotelAdapter } from './adapters/evotel.adapter';
import { ProductRepository } from '../database/repositories/product.repository';
import { CoverageResult, CoverageTechnology, ProviderResult } from './coverage.types';

@Injectable()
export class CoverageAggregatorService {
  private readonly adapters: CoverageAdapter[];

  constructor(
    private readonly internalAdapter: InternalCoverageAdapter,
    private readonly telkomAdapter: TelkomOpenserveAdapter,
    private readonly evotelAdapter: EvotelAdapter,
    private readonly productRepository: ProductRepository,
  ) {
    this.adapters = [
      this.internalAdapter,
      this.telkomAdapter,
      this.evotelAdapter,
    ];
  }

  async check(location: string): Promise<CoverageResult> {
    const settled = await Promise.allSettled(
      this.adapters.map((adapter) => adapter.check(location)),
    );

    const sources: ProviderResult[] = settled.map((result) => {
      if (result.status === 'fulfilled') return result.value;
      return {
        source: 'error',
        providerName: 'Provider Check Failed',
        available: false,
        message: 'Could not reach this coverage provider.',
      };
    });

    const availableSources = sources.filter(
      (source) => source.available && source.type,
    );

    const technologies = Array.from(
      new Set(availableSources.map((source) => source.type as CoverageTechnology)),
    );

    const packages = this.productRepository.findByTechnologies(technologies);
    const recommended = packages.length ? packages[0] : undefined;

    const estimatedSpeed = availableSources.length
      ? availableSources
          .map((s) => `${s.providerName}: ${s.estimatedSpeed ?? 'N/A'}`)
          .join(' | ')
      : undefined;

    return {
      location,
      available: availableSources.length > 0,
      technologies,
      estimatedSpeed,
      message: availableSources.length
        ? `Coverage available via ${availableSources.map((s) => s.providerName).join(', ')}.`
        : 'No fibre, LTE or fixed-wireless coverage could be confirmed. Please contact us for a feasibility study.',
      sources,
      packages,
      recommended,
    };
  }
}
