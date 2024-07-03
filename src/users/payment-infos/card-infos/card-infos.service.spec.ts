import { Test, TestingModule } from '@nestjs/testing';
import { CardInfosService } from './card-infos.service';

describe('CardInfosService', () => {
  let service: CardInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardInfosService],
    }).compile();

    service = module.get<CardInfosService>(CardInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
