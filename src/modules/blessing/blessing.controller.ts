import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { BlessingService } from './blessing.service';
import { QueryBaseDto } from 'src/dtos/query-base.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { BlessingItem } from './dto/blessing.dto';
import { CustomExceptionFilter } from 'src/filters/http-exception.filter';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('祝福接口管理')
@Controller('/api/blessing')
@UseFilters(CustomExceptionFilter)
export class BlessingController {
  constructor(private readonly blessingService: BlessingService) {}

  @Get('/list')
  getBlessings(
    @Query() query: QueryBaseDto,
  ): Promise<PaginationDto<BlessingItem>> {
    return this.blessingService.getBlessings(query);
  }
  @Post('/')
  createBlessing(
    @Body() data: BlessingItem,
  ): Promise<PaginationDto<BlessingItem>> {
    return this.blessingService.createBlessing(data);
  }
}
