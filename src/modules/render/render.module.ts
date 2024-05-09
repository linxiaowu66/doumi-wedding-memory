import { Module } from '@nestjs/common';
import { RenderController } from './render.controller';
import { BlessingService } from '../blessing/blessing.service';

@Module({
  providers: [BlessingService],
  controllers: [RenderController],
})
export class RenderModule {}
