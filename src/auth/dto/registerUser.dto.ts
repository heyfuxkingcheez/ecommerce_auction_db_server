import { PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/users/entities';

export class RegisterUserDto extends PickType(UserModel, [
  'nickname',
  'email',
  'password',
  'phone_number',
]) {}
