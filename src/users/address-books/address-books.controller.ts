import { Controller } from '@nestjs/common';
import { AddressBooksService } from './address-books.service';

@Controller('address-books')
export class AddressBooksController {
  constructor(private readonly addressBooksService: AddressBooksService) {}
}
