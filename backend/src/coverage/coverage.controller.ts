import { Controller, Post, Body } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageResult } from './coverage.types';
import { CheckCoverageDto } from './dto/check-coverage.dto';

@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post('check')
  async check(@Body() dto: CheckCoverageDto): Promise<CoverageResult> {
    return this.coverageService.check(dto.location);
  }
}
