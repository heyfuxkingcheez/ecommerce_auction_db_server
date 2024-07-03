import { Test, TestingModule } from '@nestjs/testing';
import { AddressBooksService } from './address-books.service';

describe('AddressBooksService', () => {
  let service: AddressBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressBooksService],
    }).compile();

    service = module.get<AddressBooksService>(AddressBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
