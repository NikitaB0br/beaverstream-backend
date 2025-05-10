import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis {
	public constructor(private readonly configService: ConfigService) {
		super({
			host: configService.getOrThrow('REDIS_HOST'),
			port: parseInt(configService.getOrThrow('REDIS_PORT')),
			password: configService.getOrThrow('REDIS_PASSWORD'),
		});
	}
}
