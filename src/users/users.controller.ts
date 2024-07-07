import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from './decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
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
  // @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async patchUserById(
    @User('id') userId: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserModel> {
    return this.usersService.patchUserById(
      userId,
      dto,
      file?.filename,
    );
  }
}
