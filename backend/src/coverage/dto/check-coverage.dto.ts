import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CheckCoverageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  location: string;
}
