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

export interface NetworkStatusResult {
  provider: 'evotel' | 'vumatel';
  area: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  updatedAt: string;
}
