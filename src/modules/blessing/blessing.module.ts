import { Module } from '@nestjs/common';
import { BlessingController } from './blessing.controller';
import { BlessingService } from './blessing.service';

@Module({
  imports: [],
  controllers: [BlessingController],
  providers: [BlessingService],
})
export class BlessingModule {}
