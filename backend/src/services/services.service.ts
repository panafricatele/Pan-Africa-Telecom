import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../database/repositories/product.repository';
import { Product, ServiceCategory } from '../database/types';

@Injectable()
export class ServicesService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll(category?: ServiceCategory, technology?: string): Product[] {
    return this.productRepository.findAll(category, technology);
  }
}
