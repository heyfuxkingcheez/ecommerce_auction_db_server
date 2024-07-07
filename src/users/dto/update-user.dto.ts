import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities';

export class UpdateUserDto extends PickType(UserModel, [
  'nickname',
  'phone_number',
  'password',
]) {}
