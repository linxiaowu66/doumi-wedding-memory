import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import expressLayouts from 'express-ejs-layouts';
import { join } from 'path';
import { BlessingModule } from './modules/blessing/blessing.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { TraceMiddleware } from './middlewares/trace.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import * as schema from './database/schema';
import { RenderModule } from './modules/render/render.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { ENV } from './utils/constants';
import DailyRotateFile = require('winston-daily-rotate-file');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const expressLayouts = require('express-ejs-layouts');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { xss } = require('express-xss-sanitizer');

const { format } = winston;
const { combine } = winston.format;

const baseFormat = combine(
  format.errors({ stack: true }),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
  format.label({
    label: '豆米',
  }),

  format.splat(),
  format.printf((info) => {
    if (info.stack) {
      return `${info.timestamp} ${info.level}: [${info.label}]${info.stack}`;
    }
    return `${info.timestamp} ${info.level}: [${info.label}]${info.message}`;
  }),
  // format.prettyPrint(),
);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    // TODO: 目前HTTP请求的日志无法打印到x-request-id，待后续找个办法打印
    WinstonModule.forRootAsync({
      useFactory: async () => {
        await ConfigModule.envVariablesLoaded;
        // configService可以拿到当前环境的配置
        const transports: winston.transport[] = [
          new winston.transports.Console({
            level: 'info',
            // 这里还有顺序差别的
            format: combine(format.colorize({ level: true }), baseFormat),
          }),
        ];

        if (process.env.NODE_ENV !== ENV.LOCAL) {
          transports.push(
            new DailyRotateFile({
              filename: `${process.env.LOGGER_PATH}/doumi-wedding-%DATE%.log`,
              frequency: '1d',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
            }),
          );
          transports.push(
            new DailyRotateFile({
              filename: `${process.env.LOGGER_PATH}/doumi-wedding-error-%DATE%.log`,
              level: 'error',
              frequency: '1d',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '30d',
            }),
          );
        }
        // options
        return {
          exitOnError: false,
          // defaultMeta: { service: 'aaaa' },
          format: baseFormat,

          transports,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    DrizzleMySqlModule.register({
      tag: 'DB_PROD',
      mysql: {
        connection: 'client',
        config: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
        },
      },
      // , logger: true 可以打开日志
      config: { schema: { ...schema }, mode: 'default' },
    }),
    BlessingModule,
    RenderModule,
  ],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware, LoggerMiddleware).forRoutes('/');
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  // 全局的logger
  app.useLogger(nestWinston);

  app.use(xss());

  app.use(expressLayouts);
  app.useStaticAssets(join(__dirname, '../..', 'public'));
  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.setViewEngine('ejs');

  if (process.env.NODE_ENV === 'local') {
    // open with 8080/swagger
    const swaggerConfig = new DocumentBuilder()
      .setTitle('豆米婚礼纪念')
      .setDescription('纪念网站的API')
      .setVersion('1.0.0')
      // .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, swaggerDocument);
  }

  await app.listen(8080);
}
bootstrap();
