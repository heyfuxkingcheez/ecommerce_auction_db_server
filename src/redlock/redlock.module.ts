import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Global()
@Module({
  providers: [
    {
      provide: 'Redlock',
      useFactory: (configService: ConfigService) => {
        console.log(
          configService.get<number>('REDIS_LOCK1_PORT'),
        );
        const redisLock1 = new Redis({
          host: 'redis-server',
          port: configService.get<number>(
            'REDIS_LOCK1_PORT',
          ),
        });
        const redisLock2 = new Redis({
          host: 'redis-server',
          port: configService.get<number>(
            'REDIS_LOCK2_PORT',
          ),
        });
        const redisLock3 = new Redis({
          host: 'redis-server',
          port: configService.get<number>(
            'REDIS_LOCK3_PORT',
          ),
        });
        const redisLock4 = new Redis({
          host: 'redis-server',
          port: configService.get<number>(
            'REDIS_LOCK4_PORT',
          ),
        });
        const redisLock5 = new Redis({
          host: 'redis-server',
          port: configService.get<number>(
            'REDIS_LOCK5_PORT',
          ),
        });

        return new Redlock(
          [
            redisLock1,
            redisLock2,
            redisLock3,
            redisLock4,
            redisLock5,
          ],
          {
            driftFactor: 0.01,
            retryCount: 100,
            retryDelay: 1000,
            retryJitter: 200,
          },
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: ['Redlock'],
})
export class RedlockModule {}
