import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressBookModel } from './entities/address_book.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UserModel } from '../entities';
import { Address } from 'cluster';

@Injectable()
export class AddressBooksService {
  constructor(
    @InjectRepository(AddressBookModel)
    private readonly addressBookRepository: Repository<AddressBookModel>,
  ) {}

  async createAddress(
    userId: string,
    dto: CreateAddressDto,
  ): Promise<AddressBookModel> {
    const address = this.addressBookRepository.create({
      user: {
        id: userId,
      },
      ...dto,
    });

    const newAddress =
      await this.addressBookRepository.save(address);

    return newAddress;
  }

  async getAddressById(
    id: string,
    userId: string,
  ): Promise<AddressBookModel | null> {
    const address =
      await this.addressBookRepository.findOne({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });

    if (!address)
      throw new BadRequestException(
        '존재하지 않는 주소입니다.',
      );

    return address;
  }

  async getAddressListById(
    userId: string,
  ): Promise<AddressBookModel[] | null> {
    const addressList =
      await this.addressBookRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });

    if (!addressList)
      throw new NotFoundException(
        '등록된 주소가 없습니다.',
      );

    return addressList;
  }

  async deleteAddressById(
    userId: string,
    addressId: string,
  ) {
    const address = await this.getAddressById(
      addressId,
      userId,
    );

    if (!address)
      throw new NotFoundException(
        '존재하지 않는 주소입니다.',
      );

    return await this.addressBookRepository.remove(address);
  }
}
