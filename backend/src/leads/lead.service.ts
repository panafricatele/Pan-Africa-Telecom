import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';

interface Lead extends CreateLeadDto {
  id: string;
  createdAt: Date;
}

@Injectable()
export class LeadService {
  private leads: Lead[] = [];

  create(dto: CreateLeadDto) {
    const lead: Lead = {
      ...dto,
      id: `LEAD-${Date.now()}`,
      createdAt: new Date(),
    };
    this.leads.push(lead);
    return { id: lead.id, status: 'received', timestamp: lead.createdAt };
  }
}
