import { Injectable } from '@nestjs/common';
import coverageZonesData from '../coverage-zones.json';
import { CoverageZone } from '../types';

@Injectable()
export class CoverageRepository {
  private zones: CoverageZone[] = coverageZonesData as CoverageZone[];

  reload() {
    this.zones = coverageZonesData as CoverageZone[];
  }

  findByLocation(rawLocation: string): CoverageZone[] {
    const location = rawLocation.toLowerCase();
    return this.zones.filter((zone) =>
      zone.keywords.some((keyword) => location.includes(keyword.toLowerCase())),
    );
  }
}
