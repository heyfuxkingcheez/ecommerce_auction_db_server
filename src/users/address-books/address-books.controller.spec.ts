import { Test, TestingModule } from '@nestjs/testing';
import { AddressBooksController } from './address-books.controller';
import { AddressBooksService } from './address-books.service';

describe('AddressBooksController', () => {
  let controller: AddressBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressBooksController],
      providers: [AddressBooksService],
    }).compile();

    controller = module.get<AddressBooksController>(AddressBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
