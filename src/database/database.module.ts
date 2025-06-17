import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { EnvModule } from 'src/env/env.module';

@Module({
	imports: [EnvModule],
	providers: [DatabaseProvider],
	exports: [DatabaseProvider],
})
export class DatabaseModule {}
