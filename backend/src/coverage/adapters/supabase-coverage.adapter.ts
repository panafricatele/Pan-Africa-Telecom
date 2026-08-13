import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CoverageAdapter } from './coverage-adapter.interface';
import { ProviderResult, CoverageTechnology } from '../coverage.types';

@Injectable()
export class SupabaseCoverageAdapter implements CoverageAdapter {
  private supabase;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY env vars required');
    }
    this.supabase = createClient(url, key);
  }

  async check(location: string): Promise<ProviderResult> {
    try {
      const { data, error } = await this.supabase
        .from('coverage_areas')
        .select('*')
        .ilike('city', `%${location}%`)
        .or(`area.ilike.%${location}%`)
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('Supabase error:', error);
        return {
          source: 'supabase',
          providerName: 'Pan Africa Telecom',
          available: false,
          message: `No coverage found for "${location}". Please check the address or contact us for a feasibility study.`,
        };
      }

      if (!data || data.length === 0) {
        return {
          source: 'supabase',
          providerName: 'Pan Africa Telecom',
          available: false,
          message: `No coverage found for "${location}". Please check the address or contact us for a feasibility study.`,
        };
      }

      const area = data[0];
      const technologies = (area.technologies || []) as CoverageTechnology[];
      const estimatedSpeed = this.getEstimatedSpeed(technologies);

      return {
        source: 'supabase',
        providerName: 'Pan Africa Telecom',
        available: true,
        type: technologies[0] || 'fibre',
        estimatedSpeed,
        message: `Pan Africa Telecom coverage available in ${area.city} - ${area.area} via ${technologies.join(', ')}.`,
      };
    } catch (err: any) {
      console.error('Coverage check error:', err);
      return {
        source: 'supabase',
        providerName: 'Pan Africa Telecom',
        available: false,
        message: 'Could not check coverage at this time.',
      };
    }
  }

  private getEstimatedSpeed(technologies: CoverageTechnology[]): string {
    if (technologies.includes('fibre')) return 'Up to 200 Mbps';
    if (technologies.includes('fixed-wireless')) return 'Up to 100 Mbps';
    if (technologies.includes('lte')) return 'Up to 50 Mbps';
    return 'Variable';
  }
}
