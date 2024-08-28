import {
  Controller,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { User } from 'src/users/decorator/user.decorator';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  sendClientAlarm(
    @User('id') userId: string,
  ): Observable<MessageEvent> {
    return this.sseService.subscribeToEvents(userId);
  }
}
