import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Envs } from '../envs';

@Injectable()
export class EnvService {
	constructor(private configService: ConfigService<Envs>) {}

	get<T extends keyof Envs>(key: T) {
		return this.configService.get(key) as Envs[T];
	}
}
