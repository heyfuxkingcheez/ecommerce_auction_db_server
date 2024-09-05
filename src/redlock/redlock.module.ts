import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Global()
@Module({
  providers: [
    {
      provide: 'Redlock',
      useFactory: async (configService: ConfigService) => {
        const redisLocks = [1, 2, 3, 4, 5].map(
          (i) =>
            new Redis({
              host: configService.get<string>(
                `REDIS_LOCK${i}_HOST`,
              ),
              port: configService.get<number>(
                `REDIS_LOCK${i}_PORT`,
              ),
            }),
        );

        redisLocks.forEach((client, index) => {
          client.on('connect', () =>
            console.log(`redis_lock${index + 1} connected`),
          );
          client.on('error', (err) =>
            console.error(
              `Error in redis_lock${index + 1}:`,
              err,
            ),
          );
        });

        return new Redlock(redisLocks, {
          driftFactor: 0.01,
          retryCount: 100,
          retryDelay: 1000,
          retryJitter: 200,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['Redlock'],
})
export class RedlockModule {}
