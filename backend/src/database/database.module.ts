import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CoverageRepository } from './repositories/coverage.repository';
import { PhoneRepository } from './repositories/phone.repository';

@Module({
  providers: [ProductRepository, CoverageRepository, PhoneRepository],
  exports: [ProductRepository, CoverageRepository, PhoneRepository],
})
export class DatabaseModule {}
