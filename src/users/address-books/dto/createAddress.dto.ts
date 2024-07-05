import { PickType } from '@nestjs/mapped-types';
import { AddressBookModel } from '../entities/address_book.entity';

export class CreateAddressDto extends PickType(AddressBookModel, [
  'address_name',
  'address',
  'name',
  'zip_code',
]) {}
