import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './decorator/user.decorator';
import { UserModel } from './entities';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return await this.usersService.getAllUsers();
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  async patchUserById(
    @User('id') userId: string,
    @Body() dto: UpdateUserDto,
    @QueryRunner() qr: QR,
  ): Promise<UserModel> {
    if (dto.image)
      await this.usersService.createUserImage(dto, qr);

    return this.usersService.patchUserById(userId, dto, qr);
  }
}
