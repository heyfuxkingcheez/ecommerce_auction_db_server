import { Module } from '@nestjs/common';
import { AddressBooksService } from './address-books.service';
import { AddressBooksController } from './address-books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookModel } from './entities/address_book.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from '../users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressBookModel]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AddressBooksController],
  providers: [AddressBooksService],
  exports: [AddressBooksService],
})
export class AddressBooksModule {}
