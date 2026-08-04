import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CoverageZone } from '../types';

@Injectable()
export class CoverageRepository {
  private zones: CoverageZone[];
  private readonly path = join(__dirname, '..', 'coverage-zones.json');

  constructor() {
    this.load();
  }

  private load() {
    const raw = readFileSync(this.path, 'utf8');
    this.zones = JSON.parse(raw) as CoverageZone[];
  }

  reload() {
    this.load();
  }

  findByLocation(rawLocation: string): CoverageZone[] {
    const location = rawLocation.toLowerCase();
    return this.zones.filter((zone) =>
      zone.keywords.some((keyword) => location.includes(keyword.toLowerCase())),
    );
  }
}
