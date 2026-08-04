import { Product } from '../database/types';

export type CoverageTechnology = 'fibre' | 'fixed-wireless' | 'lte';

export interface ProviderResult {
  source: string;
  providerName: string;
  available: boolean;
  type?: CoverageTechnology;
  estimatedSpeed?: string;
  message: string;
}

export interface CoverageResult {
  location: string;
  available: boolean;
  technologies: CoverageTechnology[];
  estimatedSpeed?: string;
  message: string;
  sources: ProviderResult[];
  packages: Product[];
  recommended?: Product;
}
