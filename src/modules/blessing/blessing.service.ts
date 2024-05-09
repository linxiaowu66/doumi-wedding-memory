import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import * as schema from '../../database/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { desc, count } from 'drizzle-orm';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { BlessingItem } from './dto/blessing.dto';
import { AwesomeHelp } from 'awesome-js';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class BlessingService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject('DB_PROD') private drizzleProd: MySql2Database<typeof schema>,
  ) {}
  async getBlessings(query: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginationDto<BlessingItem>> {
    const [filterList, totalCount] = await Promise.all([
      this.drizzleProd.query.blessing.findMany({
        orderBy: desc(schema.blessing.createdAt),
        limit: +query.pageSize,
        offset: +query.pageSize * (+query.pageIndex - 1),
      }),
      this.drizzleProd.select({ count: count() }).from(schema.blessing),
    ]);
    const records = filterList.map((item) => {
      let timeDesc = '';
      const timeOffset = Math.floor(
        (Date.now() - new Date(item.createdAt).getTime()) / 1000,
      );
      const leftDay = Math.floor(timeOffset / 60 / 60 / 24);
      const leftHours = Math.floor((timeOffset / 60 / 60) % 24);
      const leftMinutes = Math.floor((timeOffset / 60) % 60);
      const leftSeconds = Math.floor(timeOffset % 60);
      const leftMonth = Math.floor(leftDay / 30);
      const leftYear = Math.floor(leftMonth / 12);

      if (leftYear != 0) {
        timeDesc = leftYear + ' 年前';
      } else if (leftMonth != 0) {
        timeDesc = leftMonth + ' 个月前';
      } else if (leftDay != 0) {
        timeDesc = leftDay + ' 天前';
      } else if (leftHours != 0) {
        timeDesc = leftHours + ' 小时前';
      } else if (leftMinutes != 0) {
        timeDesc = leftMinutes + ' 分钟前';
      } else {
        timeDesc = leftSeconds + ' 秒前';
      }

      return {
        nickname: item.nickname,
        advice: item.advice,
        blessing: item.blessing,
        timeDescription: timeDesc,
      };
    });
    return {
      list: records,
      total: totalCount[0].count,
      pageIndex: +query.pageIndex,
      totalPage: Math.ceil(totalCount[0].count / query.pageSize),
    };
  }

  async createBlessing(
    data: typeof schema.blessing.$inferInsert,
  ): Promise<PaginationDto<BlessingItem>> {
    const { nickname, advice, blessing } = data;

    const result = AwesomeHelp.checkSensitiveWord(blessing);
    const result1 = AwesomeHelp.checkSensitiveWord(nickname);
    const result2 = AwesomeHelp.checkSensitiveWord(advice);

    if (result.size) {
      throw new HttpException(
        '祝福的内容不合时宜，请重新输入',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (result1.size) {
      throw new HttpException('昵称太骚了，请重新输入', HttpStatus.BAD_REQUEST);
    }

    if (result2.size) {
      throw new HttpException(
        '建议的内容太露骨了，请重新输入',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(`送祝福接口调用: ${JSON.stringify(data)}`);
    // TODO：如果我不传createdAt，那么mysql会自动按照local的时间存储进去，但是读回来却被认为是UTC时间
    // 导致我的转换有问题，查了drizzle对应的文档和issue，有讨论这个，但是试了很多办法
    // 都没用
    await this.drizzleProd
      .insert(schema.blessing)
      .values({ ...data, createdAt: new Date() });

    return this.getBlessings({ pageIndex: 1, pageSize: 6 });
  }
}
