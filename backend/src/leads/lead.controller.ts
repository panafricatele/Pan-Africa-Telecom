import { Controller, Post, Body } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('signup')
  signup(@Body() dto: CreateLeadDto) {
    return this.leadService.create(dto);
  }
}
