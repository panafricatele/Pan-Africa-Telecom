import { CoverageResponse, LeadRequest, Package, ServiceCategory, TicketRequest, Phone, CheckoutRequest, PayFastPayment } from '../types';
import { supabase } from './supabase';

const API_BASE = '/api/v1';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }
  return res.json();
}

export const coverageApi = {
  check: (location: string) =>
    post<CoverageResponse>(`${API_BASE}/coverage/check`, { location }),
};

export const networkStatusApi = {
  list: () => get(`${API_BASE}/network-status`),
  evotelComponents: () => get(`${API_BASE}/network-status/evotel-components`),
};

export const servicesApi = {
  list: async (category?: ServiceCategory, technology?: string): Promise<Package[]> => {
    try {
      let query = supabase.from('packages').select('*');
      if (category) query = query.eq('category', category);
      if (technology) query = query.contains('technologies', [technology]);
      const { data, error } = await query.order('price');
      if (error || !data || data.length === 0) throw new Error('fallback');
      return data.map((row: any) => ({
        id: row.id,
        category: row.category,
        technologies: row.technologies,
        name: row.name,
        tagline: row.tagline ?? '',
        price: Number(row.price),
        priceLabel: row.price_label,
        speed: row.speed ?? undefined,
        uncapped: row.uncapped,
        features: row.features,
        demandRange: row.demand_range as [number, number],
      }));
    } catch {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (technology) params.set('technology', technology);
      const qs = params.toString();
      return get<Package[]>(`${API_BASE}/services${qs ? `?${qs}` : ''}`);
    }
  },
};

export const leadApi = {
  signup: (lead: LeadRequest) =>
    post<{ id: string; status: string }>(`${API_BASE}/leads/signup`, lead),
};

export const ticketsApi = {
  create: (ticket: TicketRequest) =>
    post<{ id: string; status: string; message: string }>(`${API_BASE}/tickets`, ticket),
};

export const phonesApi = {
  list: async (): Promise<Phone[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (error || !data || data.length === 0) throw new Error('fallback');
      return data.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        category: row.category,
        name: row.name,
        brand: row.brand,
        model: row.model,
        color: row.color,
        colorCode: row.color_code,
        price: Number(row.price),
        compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
        stock: row.stock,
        image: row.image,
        description: row.description,
        specs: row.specs as Record<string, string>,
      }));
    } catch {
      return get<Phone[]>(`${API_BASE}/phones`);
    }
  },
};

export const checkoutApi = {
  payfast: (request: CheckoutRequest) =>
    post<{ orderId: string; action: string; payment: PayFastPayment }>(`${API_BASE}/checkout/payfast`, request),
};
