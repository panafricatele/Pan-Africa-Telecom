import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CoverageAdapter } from './adapters/coverage-adapter.interface';
import { InternalCoverageAdapter } from './adapters/internal-coverage.adapter';
import { TelkomOpenserveAdapter } from './adapters/telkom-openserve.adapter';
import { EvotelAdapter } from './adapters/evotel.adapter';
import { SupabaseCoverageAdapter } from './adapters/supabase-coverage.adapter';
import { ProductRepository } from '../database/repositories/product.repository';
import { CoverageResult, CoverageTechnology, ProviderResult } from './coverage.types';

@Injectable()
export class CoverageAggregatorService {
  private readonly adapters: CoverageAdapter[];
  private supabase;

  constructor(
    private readonly supabaseAdapter: SupabaseCoverageAdapter,
    private readonly internalAdapter: InternalCoverageAdapter,
    private readonly telkomAdapter: TelkomOpenserveAdapter,
    private readonly evotelAdapter: EvotelAdapter,
    private readonly productRepository: ProductRepository,
  ) {
    this.adapters = [
      this.supabaseAdapter,
      this.internalAdapter,
      this.telkomAdapter,
      this.evotelAdapter,
    ];
    const url = process.env.SUPABASE_URL || 'https://nydtwlzhaqpnzcvaijkk.supabase.co';
    const key = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHR3bHpoYXFwbnpjdmFpamtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTY0OTQsImV4cCI6MjEwMTY5MjQ5NH0.GmB0SzsC-kjGi5_rJDs_Ax3IwVjjbkiXD10HwPLSmgU';
    this.supabase = createClient(url, key);
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

    let packages = this.productRepository.findByTechnologies(technologies);

    // If Supabase coverage found, use the specific packages from coverage_areas table
    const supabaseSource = sources.find((s) => s.source === 'supabase' && s.available);
    if (supabaseSource && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('coverage_areas')
          .select('package_ids')
          .ilike('city', `%${location}%`)
          .or(`area.ilike.%${location}%`)
          .eq('is_active', true)
          .limit(1);

        if (!error && data && data.length > 0) {
          const area = data[0];
          if (area.package_ids && area.package_ids.length > 0) {
            packages = this.productRepository
              .findAll()
              .filter((p) => area.package_ids.includes(p.id));
          }
        }
      } catch (err) {
        // Fallback to technology-based packages
      }
    }

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
