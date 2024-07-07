import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(UserModel, [
  'nickname',
  'phone_number',
  'password',
]) {
  @IsOptional()
  image: string;

  @IsOptional()
  nickname: string;

  @IsOptional()
  phone_number: string;

  @IsOptional()
  password: string;
}
