import {
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagDto } from './dto/tag.dto';
import { TagItemDto } from './dto/tag-item.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async postTag(@Body() dto: TagDto) {
    return await this.tagsService.postTag(dto);
  }

  @Post('tag-item')
  @UseInterceptors(TransactionInterceptor)
  async postTagItem(
    @Body() dto: TagItemDto,
    @QueryRunner() qr?: QR,
  ) {
    return await this.tagsService.postTagItem(dto, qr);
  }
}
