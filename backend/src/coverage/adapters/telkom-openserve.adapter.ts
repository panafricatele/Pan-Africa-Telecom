import { Injectable } from '@nestjs/common';
import { CoverageAdapter } from './coverage-adapter.interface';
import { ProviderResult } from '../coverage.types';
import * as providersConfig from '../../database/providers.json';

/**
 * Adapter for Telkom LTE and Openserve Fibre coverage checks.
 *
 * When `mock` is true, the adapter returns deterministic sample data
 * based on well-known town names. To use the real Telkom/Openserve API,
 * set `mock: false` and provide the `baseUrl` + `apiKey` in
 * `database/providers.json`, then replace the implementation below with
 * an HTTP call (e.g. via @nestjs/axios).
 */
@Injectable()
export class TelkomOpenserveAdapter implements CoverageAdapter {
  readonly source = 'telkom-openserve';
  private readonly config = providersConfig.telkomOpenserve;

  async check(location: string): Promise<ProviderResult> {
    if (!this.config.enabled) {
      return this.disabled();
    }

    if (this.config.mock) {
      return this.mockCheck(location);
    }

    // TODO: Replace with real HTTP call to Telkom/Openserve coverage API.
    return this.mockCheck(location);
  }

  private disabled(): ProviderResult {
    return {
      source: this.source,
      providerName: this.config.name,
      available: false,
      message: 'Telkom / Openserve coverage checks are disabled.',
    };
  }

  private mockCheck(location: string): ProviderResult {
    const loc = location.toLowerCase();

    const fibreTowns = [
      'newcastle', 'johannesburg', 'durban', 'pretoria', 'cape town',
      'port elizabeth', 'bloemfontein', 'polokwane', 'centurion', 'midrand', 'sandton',
    ];

    const lteTowns = [
      'newcastle', 'johannesburg', 'durban', 'pretoria', 'cape town',
      'port elizabeth', 'bloemfontein', 'nelspruit', 'polokwane', 'rustenburg',
    ];

    const hasFibre = fibreTowns.some((town) => loc.includes(town));
    const hasLte = lteTowns.some((town) => loc.includes(town));

    if (hasFibre) {
      return {
        source: this.source,
        providerName: this.config.name,
        available: true,
        type: 'fibre',
        estimatedSpeed: 'Up to 100 Mbps',
        message: 'Openserve Fibre is available in this area (mock data).',
      };
    }

    if (hasLte) {
      return {
        source: this.source,
        providerName: this.config.name,
        available: true,
        type: 'lte',
        estimatedSpeed: 'Up to 10 Mbps',
        message: 'Telkom LTE coverage is available in this area (mock data).',
      };
    }

    return {
      source: this.source,
      providerName: this.config.name,
      available: false,
      message: 'Telkom / Openserve coverage could not be confirmed for this area (mock data).',
    };
  }
}
