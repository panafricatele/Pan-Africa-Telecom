import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  @IsNotEmpty()
  phoneId: string;

  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;
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

  @IsUrl()
  returnUrl: string;

  @IsUrl()
  cancelUrl: string;

  @IsUrl()
  notifyUrl: string;

  @IsOptional()
  @IsBoolean()
  sandbox?: boolean;
}
