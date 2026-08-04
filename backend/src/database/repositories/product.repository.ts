import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Product, ServiceCategory } from '../types';

@Injectable()
export class ProductRepository {
  private products: Product[];
  private readonly path = join(__dirname, '..', 'products.json');

  constructor() {
    this.load();
  }

  private load() {
    const raw = readFileSync(this.path, 'utf8');
    this.products = JSON.parse(raw) as Product[];
  }

  /**
   * Reload products from disk. Useful after editing prices/packages
   * without restarting the server (or call on a schedule).
   */
  reload() {
    this.load();
  }

  findAll(category?: ServiceCategory, technology?: string): Product[] {
    let items = this.products;
    if (category) {
      items = items.filter((p) => p.category === category);
    }
    if (technology) {
      items = items.filter((p) => p.technologies.includes(technology));
    }
    return items;
  }

  findByIds(ids: string[]): Product[] {
    return this.products.filter((p) => ids.includes(p.id));
  }

  findByTechnologies(technologies: string[]): Product[] {
    if (!technologies.length) return [];
    return this.products.filter((p) =>
      p.technologies.some((t) => technologies.includes(t)),
    );
  }

  findOne(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
