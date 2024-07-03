import { Module } from '@nestjs/common';
import { AddressBooksService } from './address-books.service';
import { AddressBooksController } from './address-books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookModel } from './entities/address_book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressBookModel])],
  controllers: [AddressBooksController],
  providers: [AddressBooksService],
})
export class AddressBooksModule {}
