import { Controller, Get, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Product } from '../database/types';
import { ListServicesDto } from './dto/list-services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll(@Query() dto?: ListServicesDto): Product[] {
    return this.servicesService.findAll(dto?.category, dto?.technology);
  }
}
