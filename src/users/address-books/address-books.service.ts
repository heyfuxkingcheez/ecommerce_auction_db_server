import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressBookModel } from './entities/address_book.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UserModel } from '../entities';

@Injectable()
export class AddressBooksService {
  constructor(
    @InjectRepository(AddressBookModel)
    private readonly addressBookRepository: Repository<AddressBookModel>,
  ) {}

  async createAddressById(
    userId: string,
    dto: CreateAddressDto,
  ): Promise<AddressBookModel> {
    const address = this.addressBookRepository.create({
      user: {
        id: userId,
      },
      ...dto,
    });

    const newAddress = await this.addressBookRepository.save(address);

    return newAddress;
  }

  async getAddressById(id: string): Promise<AddressBookModel | null> {
    const address = await this.addressBookRepository.findOne({
      where: {
        id,
      },
    });

    if (!address) throw new NotFoundException('존재하지 않는 주소입니다.');

    return address;
  }
}
