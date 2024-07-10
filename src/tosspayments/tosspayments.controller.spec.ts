import { Test, TestingModule } from '@nestjs/testing';
import { TosspaymentsController } from './tosspayments.controller';
import { TosspaymentsService } from './tosspayments.service';

describe('TosspaymentsController', () => {
  let controller: TosspaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TosspaymentsController],
      providers: [TosspaymentsService],
    }).compile();

    controller = module.get<TosspaymentsController>(TosspaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
