import { Injectable, MessageEvent } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private events$: Subject<any> = new Subject();

  emitEvent(userId: string, message: string) {
    this.events$.next({ userId, message });
  }

  subscribeToEvents(
    userId: string,
  ): Observable<MessageEvent> {
    return this.events$.pipe(
      filter((event) => event.userId === userId),
      map((event) => ({
        data: {
          message: event.message,
        },
      })),
    );
  }
}
