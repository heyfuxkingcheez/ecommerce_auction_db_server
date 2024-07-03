import { Controller } from '@nestjs/common';
import { CardInfosService } from './card-infos.service';

@Controller('card-infos')
export class CardInfosController {
  constructor(private readonly cardInfosService: CardInfosService) {}
}
