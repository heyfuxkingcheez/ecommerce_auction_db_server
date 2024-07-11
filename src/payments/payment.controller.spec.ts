import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payment.controller';
import { PaymentsService } from './payment.service';

describe('PaymentInfosController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PaymentsController],
        providers: [PaymentsService],
      }).compile();

    controller = module.get<PaymentsController>(
      PaymentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
