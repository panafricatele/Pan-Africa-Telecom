import { Controller, Get, Param } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { Phone } from '../database/types';

@Controller('phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Get()
  findAll(): Phone[] {
    return this.phonesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Phone | undefined {
    return this.phonesService.findById(id);
  }
}
