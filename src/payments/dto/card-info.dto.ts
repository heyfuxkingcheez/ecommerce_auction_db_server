import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CardInfoDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  birthOrBusinessRegistrationNumber: string;

  @IsString()
  @IsNotEmpty()
  passwordTwoDigits: string;

  @IsString()
  @IsNotEmpty()
  payment_password: string;
}
