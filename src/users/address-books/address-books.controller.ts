import {
  Body,
  Controller,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressBooksService } from './address-books.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { User } from '../decorator/user.decorator';
import { AddressBookModel } from './entities/address_book.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('users/address_books')
export class AddressBooksController {
  constructor(private readonly addressBooksService: AddressBooksService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async postAddressById(
    @User('id', ParseUUIDPipe) userId: string,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressBookModel> {
    const address = await this.addressBooksService.createAddressById(
      userId,
      dto,
    );

    return this.addressBooksService.getAddressById(address.id);
  }
}
