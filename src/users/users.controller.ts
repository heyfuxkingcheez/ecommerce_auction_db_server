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
  async patchUserById(
    @User('id') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    if (dto.image)
      await this.usersService.createUserImage(dto);

    return this.usersService.patchUserById(userId, dto);
  }
}
