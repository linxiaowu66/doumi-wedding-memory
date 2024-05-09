import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { BlessingService } from '../blessing/blessing.service';

@Controller('/')
export class RenderController {
  constructor(private readonly blessingService: BlessingService) {}

  @Get('/')
  async homePage(@Res() res: Response): Promise<void> {
    const data = await this.blessingService.getBlessings({
      pageIndex: 1,
      pageSize: 6,
    });
    return res.render('weddingHome', {
      records: data.list,
      total: data.total,
      pageSize: 6,
      pageIndex: data.pageIndex,
      title: '豆米的结婚纪念网站',
    });
  }

  @Get('/meetEachOther')
  async meetEachOther(@Res() res: Response): Promise<void> {
    return res.render('meetEachOther', {
      title: '彼此遇见最美好的自己',
    });
  }

  @Get('/knowEachOther')
  async knowEachOther(@Res() res: Response): Promise<void> {
    return res.render('knowEachOther', {
      title: '相知,相爱前的蜕变与磨砺',
    });
  }
  @Get('/loveEachOther')
  async loveEachOther(@Res() res: Response): Promise<void> {
    return res.render('loveEachOther', {
      title: '相爱让我们执子之手、与子偕老',
    });
  }
  @Get('/togetherAlways')
  async alwaysTogether(@Res() res: Response): Promise<void> {
    return res.render('alwaysTogether', {
      title: '相守一生，相伴永久',
    });
  }
}
