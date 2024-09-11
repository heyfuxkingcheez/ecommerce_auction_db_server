import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './common/decorator/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  getHome() {
    return true;
  }
}
