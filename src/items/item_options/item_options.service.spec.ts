import { Test, TestingModule } from '@nestjs/testing';
import { ItemOptionsService } from './item_options.service';

describe('ItemOptionsService', () => {
  let service: ItemOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemOptionsService],
    }).compile();

    service = module.get<ItemOptionsService>(ItemOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
