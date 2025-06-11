import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		const start = Date.now();
		const { method, originalUrl } = req;

		res.on('finish', () => {
			const duration = Date.now() - start;
			const { statusCode } = res;
			this.logger.log(`${method} ${originalUrl} ${statusCode} ${duration}ms`);
		});

		next();
	}
}
