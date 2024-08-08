import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettlementAccountModel } from './entities/settlement_account.entity';
import { Repository } from 'typeorm';
import { CreateSettlementDto } from './dto/create-settlementAccount.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateSettlementAccountDto } from './dto/update-settlementAccount.dto';

@Injectable()
export class SettlementAccountsService {
  constructor(
    @InjectRepository(SettlementAccountModel)
    private readonly settlementAccountRepository: Repository<SettlementAccountModel>,
    private readonly usersService: UsersService,
  ) {}

  async postSettlementAccount(
    userId: string,
    dto: CreateSettlementDto,
  ) {
    const user =
      await this.usersService.getUserById(userId);

    if (!user)
      throw new BadRequestException(
        '존재하지 않는 사용자 입니다.',
      );

    const existAccount =
      await this.getSettlementAccount(userId);
    if (existAccount)
      throw new BadRequestException(
        '이미 계좌가 등록되어 있습니다.',
      );

    const newSettlementAccount =
      this.settlementAccountRepository.create({
        user: {
          id: userId,
        },
        ...dto,
      });

    const settlementAccount =
      await this.settlementAccountRepository.save(
        newSettlementAccount,
      );

    return settlementAccount;
  }

  async getSettlementAccount(userId: string) {
    const latestAccount =
      await this.settlementAccountRepository.findOne({
        order: { created_at: 'DESC' },
        where: {
          user: {
            id: userId,
          },
        },
      });

    return latestAccount;
  }

  async putSettlementAccount(
    userId: string,
    dto: UpdateSettlementAccountDto,
  ) {
    const account = await this.getSettlementAccount(userId);

    if (!account)
      throw new NotFoundException(
        '해당 계좌가 존재하지 않습니다.',
      );

    account.bank_name = dto.bank_name;
    account.account_holder = dto.account_holder;
    account.account_number = dto.account_number;

    return await this.settlementAccountRepository.save(
      account,
    );
  }
}
