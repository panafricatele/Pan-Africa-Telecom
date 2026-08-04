export type ServiceCategory = 'internet' | 'lte' | 'global' | 'voice' | 'solar';

export interface Product {
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

export type CoverageType = 'fibre' | 'fixed-wireless' | 'lte';

export interface CoverageZone {
  id: string;
  provider: 'internal';
  type: CoverageType;
  name: string;
  keywords: string[];
  estimatedSpeed?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  baseUrl?: string;
  apiKey?: string;
  mock?: boolean;
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
