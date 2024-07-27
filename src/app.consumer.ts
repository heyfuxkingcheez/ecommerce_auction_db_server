import { Logger } from '@nestjs/common';

export class AppConsumer {
  private readonly logger = new Logger(AppConsumer.name);
}
