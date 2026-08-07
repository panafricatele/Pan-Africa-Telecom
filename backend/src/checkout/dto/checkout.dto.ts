import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  @IsNotEmpty()
  phoneId: string;

  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  returnUrl: string;

  @IsString()
  @IsNotEmpty()
  cancelUrl: string;

  @IsString()
  @IsNotEmpty()
  notifyUrl: string;

  @IsOptional()
  @IsBoolean()
  sandbox?: boolean;
}
