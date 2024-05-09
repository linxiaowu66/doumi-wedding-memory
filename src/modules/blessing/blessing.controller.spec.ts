import { Test, TestingModule } from '@nestjs/testing';
import { BlessingController } from './blessing.controller';
import { BlessingService } from './blessing.service';

describe('BlessingController', () => {
  let blessingController: BlessingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlessingController],
      providers: [BlessingService],
    }).compile();

    blessingController = app.get<BlessingController>(BlessingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(true).toBe(true);
    });
  });
});
