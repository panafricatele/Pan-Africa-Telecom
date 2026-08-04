import { Injectable } from '@nestjs/common';
import { CoverageRepository } from '../../database/repositories/coverage.repository';
import { CoverageAdapter } from './coverage-adapter.interface';
import { ProviderResult } from '../coverage.types';

@Injectable()
export class InternalCoverageAdapter implements CoverageAdapter {
  readonly source = 'internal';

  constructor(private readonly coverageRepository: CoverageRepository) {}

  async check(location: string): Promise<ProviderResult> {
    const zones = this.coverageRepository.findByLocation(location);

    if (!zones.length) {
      return {
        source: this.source,
        providerName: 'Pan Africa Telecom',
        available: false,
        message: 'Not currently in our own wireless or fibre coverage database.',
      };
    }

    const fibre = zones.find((z) => z.type === 'fibre');
    const wireless = zones.find((z) => z.type === 'fixed-wireless');

    if (fibre) {
      return {
        source: this.source,
        providerName: 'Pan Africa Telecom',
        available: true,
        type: 'fibre',
        estimatedSpeed: fibre.estimatedSpeed,
        message: `${fibre.name} is active in this area.`,
      };
    }

    return {
      source: this.source,
      providerName: 'Pan Africa Telecom',
      available: true,
      type: 'fixed-wireless',
      estimatedSpeed: wireless?.estimatedSpeed,
      message: `${wireless?.name ?? 'Our fixed-wireless network'} is active in this area.`,
    };
  }
}
