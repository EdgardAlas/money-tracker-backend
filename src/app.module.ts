import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HealthModule } from './features/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { envs } from 'src/env/envs';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';

@Module({
	imports: [
		HealthModule,
		ConfigModule.forRoot({
			load: [envs],
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
