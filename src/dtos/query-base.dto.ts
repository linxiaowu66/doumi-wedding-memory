import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class QueryBaseDto {
  @ApiProperty({ description: '每页条目数', required: false })
  @IsNumberString()
  pageSize: number;

  @ApiProperty({ description: '查询的页码', required: false })
  @IsNumberString()
  pageIndex: number;
}
