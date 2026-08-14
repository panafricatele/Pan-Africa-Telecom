import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EvotelComponent, NetworkStatusResult } from './network-status.types';

interface NetworkStatusMonitor {
  id: string;
  provider: 'evotel' | 'vumatel';
  area: string;
  latitude: number | null;
  longitude: number | null;
  external_id: string | null;
  status: string;
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

  async getEvotelComponents(): Promise<EvotelComponent[]> {
    try {
      const response = await fetch('https://status.evotel.co.za/v3/components.json');
      const json = await response.json();
      return (json.components || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        description: c.description || '',
        isParent: c.isParent || false,
        group: c.group,
      }));
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
            latitude: monitor.latitude,
            longitude: monitor.longitude,
            updatedAt: new Date().toISOString(),
          };
        }
        const match = evotelComponents.find(
          (c) => c.name.trim().toLowerCase() === monitor.area.trim().toLowerCase()
        );
        return {
          provider: monitor.provider,
          area: monitor.area,
          status: match ? match.status : 'NOT_FOUND',
          latitude: monitor.latitude,
          longitude: monitor.longitude,
          updatedAt: new Date().toISOString(),
        };
      }

      // Vumatel: currently returns stored status as live API not available
      return {
        provider: monitor.provider,
        area: monitor.area,
        status: monitor.status || 'OPERATIONAL',
        latitude: monitor.latitude,
        longitude: monitor.longitude,
        updatedAt: new Date().toISOString(),
      };
    });
  }
}
