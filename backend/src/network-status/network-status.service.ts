import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  EvotelComponent,
  NetworkProvider,
  NetworkStatusResult,
} from './network-status.types';

interface NetworkStatusMonitor {
  id: string;
  provider: NetworkProvider;
  area: string;
  latitude: number | null;
  longitude: number | null;
  external_id: string | null;
  status: string;
  note: string | null;
  is_active: boolean;
}

@Injectable()
export class NetworkStatusService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL || 'https://nydtwlzhaqpnzcvaijkk.supabase.co';
    const key = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHR3bHpoYXFwbnpjdmFpamtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTY0OTQsImV4cCI6MjEwMTY5MjQ5NH0.GmB0SzsC-kjGi5_rJDs_Ax3IwVjjbkiXD10HwPLSmgU';
    this.supabase = createClient(url, key);
  }

  private static readonly EVOTEL_COMPONENTS_URL =
    'https://status.evotel.co.za/v3/components.json';

  private static normalizeName(name: string): string {
    return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
  }

  private static flattenComponents(raw: any[]): EvotelComponent[] {
    const flat: EvotelComponent[] = [];
    for (const c of raw) {
      if (!c || !c.name) continue;
      flat.push({
        id: c.id,
        name: (c.name as string).trim(),
        status: c.status,
        description: c.description || '',
        isParent: c.isParent || false,
        group: c.group,
      });
      if (Array.isArray(c.children) && c.children.length > 0) {
        flat.push(...NetworkStatusService.flattenComponents(c.children));
      }
    }
    return flat;
  }

  async getEvotelComponents(): Promise<EvotelComponent[]> {
    try {
      const response = await fetch(NetworkStatusService.EVOTEL_COMPONENTS_URL);
      if (!response.ok) {
        throw new Error(`Evotel API responded with ${response.status}`);
      }
      const json = await response.json();
      // The public API returns either a bare array or { components: [...] }
      const raw = Array.isArray(json) ? json : json.components || [];
      return NetworkStatusService.flattenComponents(raw);
    } catch (err) {
      console.error('Error fetching Evotel components:', err);
      return [];
    }
  }

  async getActiveMonitors(): Promise<NetworkStatusMonitor[]> {
    const { data, error } = await this.supabase
      .from('network_status_monitors')
      .select('*')
      .eq('is_active', true)
      .order('provider')
      .order('area');

    if (error) {
      console.error('Error fetching network status monitors:', error);
      return [];
    }

    return (data as NetworkStatusMonitor[]) || [];
  }

  async getNetworkStatus(): Promise<NetworkStatusResult[]> {
    const [monitors, evotelComponents] = await Promise.all([
      this.getActiveMonitors(),
      this.getEvotelComponents(),
    ]);

    return monitors.map((monitor) => {
      if (monitor.provider === 'evotel') {
        if (evotelComponents.length === 0) {
          return {
            provider: monitor.provider,
            area: monitor.area,
            status: monitor.status || 'OPERATIONAL',
            note: monitor.note,
            latitude: monitor.latitude,
            longitude: monitor.longitude,
            updatedAt: new Date().toISOString(),
          };
        }
        const areaKey = NetworkStatusService.normalizeName(monitor.area);
        const match = evotelComponents.find(
          (c) => NetworkStatusService.normalizeName(c.name) === areaKey
        );
        return {
          provider: monitor.provider,
          area: monitor.area,
          status: match ? match.status : 'OPERATIONAL',
          note: monitor.note,
          latitude: monitor.latitude,
          longitude: monitor.longitude,
          updatedAt: new Date().toISOString(),
        };
      }

      // Vumatel and Wireless: admin-managed status, no live upstream API
      return {
        provider: monitor.provider,
        area: monitor.area,
        status: monitor.status || 'OPERATIONAL',
        note: monitor.note,
        latitude: monitor.latitude,
        longitude: monitor.longitude,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
