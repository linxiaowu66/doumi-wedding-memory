import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  @ApiProperty({ description: '每页条目数', required: false })
  list: T[];

  @ApiProperty({ description: '查询的页码', required: false })
  pageIndex: number;

  @ApiProperty({ description: '条目数', required: false })
  total: number;

  @ApiProperty({ description: '总共页码数', required: false })
  totalPage: number;
}
