import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressBooksService } from './address-books.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { User } from '../decorator/user.decorator';
import { AddressBookModel } from './entities/address_book.entity';

@Controller('users/address_books')
export class AddressBooksController {
  constructor(
    private readonly addressBooksService: AddressBooksService,
  ) {}

  @Post()
  async postAddress(
    @User('id', ParseUUIDPipe) userId: string,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressBookModel> {
    const address =
      await this.addressBooksService.createAddress(
        userId,
        dto,
      );

    return this.addressBooksService.getAddressById(
      address.id,
      userId,
    );
  }

  @Get()
  async getAddressListById(
    @User('id', ParseUUIDPipe) userId: string,
  ): Promise<AddressBookModel[]> {
    return this.addressBooksService.getAddressListById(
      userId,
    );
  }

  @Delete(':addressId')
  async deleteAddressById(
    @User('id', ParseUUIDPipe) userId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ) {
    return this.addressBooksService.deleteAddressById(
      userId,
      addressId,
    );
  }
}
