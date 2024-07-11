import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { SettlementAccountsService } from './settlement-accounts.service';
import { User } from '../decorator/user.decorator';
import { CreateSettlementDto } from './dto/create-settlementAccount.dto';
import { UpdateSettlementAccountDto } from './dto/update-settlementAccount.dto';
import { Roles } from '../decorator/roles.decorator';
import { RolesEnum } from '../const';
import { Request } from 'express';

@Controller('settlement-accounts')
export class SettlementAccountsController {
  constructor(
    private readonly settlementAccountsService: SettlementAccountsService,
  ) {}
  @Post('/me')
  @Roles(RolesEnum.USER)
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
  @Roles(RolesEnum.USER)
  async getSettlementAccount(
    @User('id') userId: string,
    @Req() req: Request,
  ) {
    console.log(req.user);

    return await this.settlementAccountsService.getSettlementAccount(
      userId,
    );
  }

  @Put('/me')
  @Roles(RolesEnum.USER)
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
