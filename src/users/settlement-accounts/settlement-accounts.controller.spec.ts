import { Test, TestingModule } from '@nestjs/testing';
import { SettlementAccountsController } from './settlement-accounts.controller';
import { SettlementAccountsService } from './settlement-accounts.service';

describe('SettlementAccountsController', () => {
  let controller: SettlementAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettlementAccountsController],
      providers: [SettlementAccountsService],
    }).compile();

    controller = module.get<SettlementAccountsController>(SettlementAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
