import { Test, TestingModule } from '@nestjs/testing';
import { PaymentInfosController } from './payment-infos.controller';
import { PaymentInfosService } from './payment-infos.service';

describe('PaymentInfosController', () => {
  let controller: PaymentInfosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentInfosController],
      providers: [PaymentInfosService],
    }).compile();

    controller = module.get<PaymentInfosController>(PaymentInfosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
