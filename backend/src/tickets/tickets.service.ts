import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';

export interface Ticket extends CreateTicketDto {
  id: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
}

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [];

  create(dto: CreateTicketDto) {
    const ticket: Ticket = {
      ...dto,
      id: `TICKET-${Date.now()}`,
      status: 'open',
      createdAt: new Date(),
    };
    this.tickets.push(ticket);
    return {
      id: ticket.id,
      status: ticket.status,
      timestamp: ticket.createdAt,
      message: 'Ticket logged. Our support team will contact you shortly.',
    };
  }

  findAll() {
    return this.tickets;
  }
}
