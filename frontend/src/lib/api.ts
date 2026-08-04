import { CoverageResponse, LeadRequest, Package, ServiceCategory, TicketRequest, Phone, CheckoutRequest, PayFastPayment } from '../types';

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

export const servicesApi = {
  list: (category?: ServiceCategory, technology?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (technology) params.set('technology', technology);
    const query = params.toString();
    return get<Package[]>(`${API_BASE}/services${query ? `?${query}` : ''}`);
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
  list: () => get<Phone[]>(`${API_BASE}/phones`),
};

export const checkoutApi = {
  payfast: (request: CheckoutRequest) =>
    post<{ orderId: string; action: string; payment: PayFastPayment }>(`${API_BASE}/checkout/payfast`, request),
};
