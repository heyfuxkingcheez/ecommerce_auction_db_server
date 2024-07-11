import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SettlementAccountsService } from './settlement-accounts.service';
import { User } from '../decorator/user.decorator';
import { CreateSettlementDto } from './dto/create-settlementAccount.dto';
import { UpdateSettlementAccountDto } from './dto/update-settlementAccount.dto';

@Controller('settlement-accounts')
export class SettlementAccountsController {
  constructor(
    private readonly settlementAccountsService: SettlementAccountsService,
  ) {}
  @Post('/me')
  async postSettlementAccount(
    @User('id') userId: string,
    @Body() dto: CreateSettlementDto,
  ) {
    return await this.settlementAccountsService.postSettlementAccount(
      userId,
      dto,
    );
  }

  @Get('/me')
  async getSettlementAccount(@User('id') userId: string) {
    return await this.settlementAccountsService.getSettlementAccount(
      userId,
    );
  }

  @Put('/me')
  async putSettlementAccount(
    @User('id') userId: string,
    @Body() dto: UpdateSettlementAccountDto,
  ) {
    return await this.settlementAccountsService.putSettlementAccount(
      userId,
      dto,
    );
  }
}
