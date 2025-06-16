import {
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { and, eq } from 'drizzle-orm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/env/database/database.provider';
import { tokens } from 'src/env/database/schema';

import { EnvService } from 'src/env/services/env.service';
import { RefreshTokenEntity } from 'src/features/auth/entities/refresh-token.entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
	Strategy,
	'refresh-strategy',
) {
	private readonly logger = new Logger(RefreshStrategy.name);
	constructor(
		private readonly configService: EnvService,
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
			secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
		});
	}

	async validate(payload: { sub: string; jti: string }) {
		const { sub, jti } = payload;

		const [refreshToken] = await this.databaseService
			.select()
			.from(tokens)
			.where(and(eq(tokens.userId, sub), eq(tokens.refreshJti, jti)));

		if (!refreshToken) {
			this.logger.warn(`⚠️ Refresh token not found: ${jti}`);
			throw new UnauthorizedException('The refresh token is not valid.');
		}

		return new RefreshTokenEntity(
			refreshToken.id,
			refreshToken.userId,
			refreshToken.refreshJti,
			refreshToken.expiresAt,
		);
	}
}
