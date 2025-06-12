import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.enableCors({
		origin: process.env.CORS_ORIGINS?.split(','),
	});

	logger.log('CORS enabled for origins:', process.env.CORS_ORIGINS);

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	logger.log(`Server timezone: ${timezone}`);

	const PORT = process.env.PORT ?? 3000;

	await app.listen(PORT);

	logger.log(`Application is running on: http://localhost:${PORT}`);
}

void bootstrap();
