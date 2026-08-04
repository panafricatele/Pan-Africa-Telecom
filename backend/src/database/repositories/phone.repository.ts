import { Injectable } from '@nestjs/common';
import phonesData from '../phones.json';
import { Phone } from '../types';

@Injectable()
export class PhoneRepository {
  private phones: Phone[] = phonesData as Phone[];

  reload() {
    this.phones = phonesData as Phone[];
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
