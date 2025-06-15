import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { envs } from 'src/env/envs';
import { HealthModule } from './features/health/health.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
	imports: [
		HealthModule,
		ConfigModule.forRoot({
			load: [envs],
		}),
		JwtModule.register({
			global: true,
		}),
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
