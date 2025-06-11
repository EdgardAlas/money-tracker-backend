import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './services/env.service';

@Module({
	imports: [ConfigModule],
	providers: [EnvService],
	exports: [EnvService],
})
export class EnvModule {}
