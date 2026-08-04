import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListServicesDto {
  @IsOptional()
  @IsString()
  @IsIn(['internet', 'lte', 'global', 'voice', 'solar'])
  category?: 'internet' | 'lte' | 'global' | 'voice' | 'solar';

  @IsOptional()
  @IsString()
  technology?: string;
}
