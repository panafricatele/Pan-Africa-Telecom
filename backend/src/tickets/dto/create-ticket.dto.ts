import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  message: string;

  @IsString()
  @IsNotEmpty()
  ticketType: 'technical' | 'billing' | 'sales' | 'general';
}
