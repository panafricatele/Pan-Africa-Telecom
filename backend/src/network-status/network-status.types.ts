export interface EvotelComponent {
  id: string;
  name: string;
  status: string;
  description: string;
  isParent: boolean;
  group?: {
    id: string;
    name: string;
    description: string;
  };
}

export type NetworkProvider = 'evotel' | 'vumatel' | 'wireless';

export interface NetworkStatusResult {
  provider: NetworkProvider;
  area: string;
  status: string;
  note?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt: string;
}
