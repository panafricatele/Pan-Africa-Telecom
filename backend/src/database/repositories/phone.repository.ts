import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Phone } from '../types';

@Injectable()
export class PhoneRepository {
  private phones: Phone[];
  private readonly path = join(__dirname, '..', 'phones.json');

  constructor() {
    this.load();
  }

  private load() {
    const raw = readFileSync(this.path, 'utf8');
    this.phones = JSON.parse(raw) as Phone[];
  }

  reload() {
    this.load();
  }

  findAll(): Phone[] {
    return this.phones;
  }

  findById(id: string): Phone | undefined {
    return this.phones.find((p) => p.id === id);
  }

  findByIds(ids: string[]): Phone[] {
    return this.phones.filter((p) => ids.includes(p.id));
  }
}
