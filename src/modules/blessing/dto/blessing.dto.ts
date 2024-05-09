import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlessingItem {
  @ApiProperty({ description: '昵称' })
  @IsNotEmpty()
  @IsString()
  nickname: string;
  @ApiProperty({ description: '建议' })
  @IsString()
  advice: string;
  @ApiProperty({ description: '祝福' })
  @IsString()
  blessing: string;
  @ApiProperty({ description: '时间' })
  @IsString()
  timeDescription?: string;
}
