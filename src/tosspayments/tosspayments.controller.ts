import { Controller, Get, Res } from '@nestjs/common';
import { TosspaymentsService } from './tosspayments.service';
import { Response } from 'express';
import { join } from 'path';
import { PUBLIC_FOLDER_PATH } from 'src/common/const/path.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('tosspayments')
export class TosspaymentsController {
  constructor(
    private readonly tosspaymentsService: TosspaymentsService,
  ) {}
  @Get()
  @IsPublic()
  getTosspayments(@Res() res: Response) {
    res.sendFile(join(PUBLIC_FOLDER_PATH, 'checkout.html'));
  }

  @Get('test')
  @IsPublic()
  test(@Res() res: Response) {}
}
