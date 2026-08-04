import { ProviderResult } from '../coverage.types';

export interface CoverageAdapter {
  readonly source: string;
  check(location: string): Promise<ProviderResult>;
}
