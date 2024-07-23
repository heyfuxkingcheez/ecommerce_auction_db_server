import { IsNumber, IsString } from 'class-validator';

export class CardInfoDto {
  @IsString()
  number: string;

  @IsString()
  expiryYear: string;

  @IsString()
  expiryMonth: string;

  @IsString()
  birthOrBusinessRegistrationNumber: string;

  @IsString()
  passwordTwoDigits: string;

  @IsString()
  payment_password: string;
}
