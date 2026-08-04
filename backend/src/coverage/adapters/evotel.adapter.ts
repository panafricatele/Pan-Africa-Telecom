import { Injectable } from '@nestjs/common';
import { CoverageAdapter } from './coverage-adapter.interface';
import { ProviderResult } from '../coverage.types';
import * as providersConfig from '../../database/providers.json';

/**
 * Adapter for Evotel Fibre coverage checks.
 *
 * When `mock` is true, the adapter returns deterministic sample data.
 * Set `mock: false` and supply `baseUrl` + `apiKey` in
 * `database/providers.json` to integrate the live Evotel API.
 */
@Injectable()
export class EvotelAdapter implements CoverageAdapter {
  readonly source = 'evotel';
  private readonly config = providersConfig.evotel;

  async check(location: string): Promise<ProviderResult> {
    if (!this.config.enabled) {
      return this.disabled();
    }

    if (this.config.mock) {
      return this.mockCheck(location);
    }

    // TODO: Replace with real HTTP call to Evotel coverage API.
    return this.mockCheck(location);
  }

  private disabled(): ProviderResult {
    return {
      source: this.source,
      providerName: this.config.name,
      available: false,
      message: 'Evotel coverage checks are disabled.',
    };
  }

  private mockCheck(location: string): ProviderResult {
    const loc = location.toLowerCase();

    const fibreTowns = [
      'newcastle', 'johannesburg', 'pretoria', 'centurion', 'midrand',
      'sandton', 'durban', 'cape town', 'rustenburg', 'nelspruit',
      'bloemfontein', 'polokwane', 'port elizabeth',
    ];

    const hasFibre = fibreTowns.some((town) => loc.includes(town));

    if (hasFibre) {
      return {
        source: this.source,
        providerName: this.config.name,
        available: true,
        type: 'fibre',
        estimatedSpeed: 'Up to 1000 Mbps',
        message: 'Evotel Fibre is available in this area (mock data).',
      };
    }

    return {
      source: this.source,
      providerName: this.config.name,
      available: false,
      message: 'Evotel Fibre coverage could not be confirmed for this area (mock data).',
    };
  }
}
