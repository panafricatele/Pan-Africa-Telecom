import { Injectable } from '@nestjs/common';
import { PhoneRepository } from '../database/repositories/phone.repository';
import { Phone } from '../database/types';

@Injectable()
export class PhonesService {
  constructor(private readonly phoneRepository: PhoneRepository) {}

  findAll(): Phone[] {
    return this.phoneRepository.findAll();
  }

  findById(id: string): Phone | undefined {
    return this.phoneRepository.findById(id);
  }

  findByIds(ids: string[]): Phone[] {
    return this.phoneRepository.findByIds(ids);
  }
}
