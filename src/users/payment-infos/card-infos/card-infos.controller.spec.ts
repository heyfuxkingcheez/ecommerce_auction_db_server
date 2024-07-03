import { Test, TestingModule } from '@nestjs/testing';
import { CardInfosController } from './card-infos.controller';
import { CardInfosService } from './card-infos.service';

describe('CardInfosController', () => {
  let controller: CardInfosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardInfosController],
      providers: [CardInfosService],
    }).compile();

    controller = module.get<CardInfosController>(CardInfosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
