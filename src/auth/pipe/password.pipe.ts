import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value.toString().length > 20 || value.length < 8) {
      throw new BadRequestException('비밀번호는 8 ~ 20 글자이어야 합니다.');
    }

    return value.toString();
  }
}
