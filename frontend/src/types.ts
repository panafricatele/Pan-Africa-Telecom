export type ServiceCategory = 'internet' | 'lte' | 'global' | 'voice' | 'solar';

export type CoverageTechnology = 'fibre' | 'fixed-wireless' | 'lte';

export interface CoverageSource {
  source: string;
  providerName: string;
  available: boolean;
  type?: CoverageTechnology;
  estimatedSpeed?: string;
  message: string;
}

export interface CoverageResponse {
  location: string;
  available: boolean;
  technologies: CoverageTechnology[];
  estimatedSpeed?: string;
  message: string;
  sources: CoverageSource[];
  packages: Package[];
  recommended?: Package;
}

export interface LeadRequest {
  fullName: string;
  email: string;
  phone?: string;
  serviceInterest: string;
  location: string;
  message?: string;
}

export interface TicketRequest {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  ticketType: 'technical' | 'billing' | 'sales' | 'general';
}

export type PhoneCategory = 'phone' | 'equipment';

export interface Phone {
  id: string;
  slug: string;
  category?: PhoneCategory;
  name: string;
  brand: string;
  model: string;
  color: string;
  colorCode: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image: string;
  description: string;
  specs: Record<string, string>;
}

export interface CartItem {
  phone: Phone;
  quantity: number;
}

export interface CheckoutRequest {
  items: { phoneId: string; quantity: number }[];
  name: string;
  email: string;
  phone?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  sandbox?: boolean;
}

export interface PayFastPayment {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  signature: string;
}

export interface Package {
  id: string;
  category: ServiceCategory;
  technologies: string[];
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  speed?: string;
  uncapped: boolean;
  features: string[];
  demandRange: [number, number];
}
