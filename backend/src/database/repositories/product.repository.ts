import { Injectable } from '@nestjs/common';
import productsData from '../products.json';
import { Product, ServiceCategory } from '../types';

@Injectable()
export class ProductRepository {
  private products: Product[] = productsData as Product[];

  /**
   * Reload products from the bundled dataset. Useful after editing
   * prices/packages without restarting the server.
   */
  reload() {
    this.products = productsData as Product[];
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
