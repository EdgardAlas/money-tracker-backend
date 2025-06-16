import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq, lt } from 'drizzle-orm';
import { DatabaseService } from 'src/env/database/database.provider';
import { tokens } from 'src/env/database/schema';
import { EnvService } from 'src/env/services/env.service';
import { TokensEntity } from 'src/features/auth/entities/tokens.entity';
import { formatDate } from 'src/lib/format-dates';

@Injectable()
export class TokensService {
	private readonly logger = new Logger(TokensService.name);

	constructor(
		private readonly jwtService: JwtService,
		private readonly envService: EnvService,
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async insert(
		userId: string,
		accessTokenJti: string,
		refreshTokenJti: string,
	) {
		const [accessToken, refreshToken] = await this.generateTokens(
			userId,
			accessTokenJti,
			refreshTokenJti,
		);

		await this.saveTokensToDatabase(userId, accessTokenJti, refreshTokenJti);

		return new TokensEntity({ accessToken, refreshToken });
	}

	async refresh(
		id: string,
		userId: string,
		accessTokenJti: string,
		refreshTokenJti: string,
	): Promise<TokensEntity> {
		const [accessToken, refreshToken] = await this.generateTokens(
			userId,
			accessTokenJti,
			refreshTokenJti,
		);

		await this.updateTokensInDatabase(id, accessTokenJti, refreshTokenJti);

		return new TokensEntity({ accessToken, refreshToken });
	}

	private async generateTokens(
		userId: string,
		accessTokenJti: string,
		refreshTokenJti: string,
	): Promise<[string, string]> {
		return Promise.all([
			this.jwtService.signAsync(
				{ sub: userId, jti: accessTokenJti },
				{
					expiresIn: this.envService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
					secret: this.envService.get('JWT_ACCESS_TOKEN_SECRET'),
				},
			),
			this.jwtService.signAsync(
				{ sub: userId, jti: refreshTokenJti },
				{
					expiresIn: this.envService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
					secret: this.envService.get('JWT_REFRESH_TOKEN_SECRET'),
				},
			),
		]);
	}

	private getRefreshTokenExpirationDays(): number {
		const expiration = this.envService.get('JWT_REFRESH_TOKEN_EXPIRATION');
		const match = /(\d+)/.exec(expiration);
		return match ? parseInt(match[0], 10) : 0;
	}

	private async saveTokensToDatabase(
		userId: string,
		accessTokenJti: string,
		refreshTokenJti: string,
	) {
		const refreshDays = this.getRefreshTokenExpirationDays();

		await this.databaseService.insert(tokens).values({
			accessJti: accessTokenJti,
			refreshJti: refreshTokenJti,
			userId,
			expiresAt: formatDate().add(refreshDays, 'days').toDate(),
		});
	}

	private async updateTokensInDatabase(
		id: string,
		accessTokenJti: string,
		refreshTokenJti: string,
	) {
		const refreshDays = this.getRefreshTokenExpirationDays();

		await this.databaseService
			.update(tokens)
			.set({
				accessJti: accessTokenJti,
				refreshJti: refreshTokenJti,
				expiresAt: formatDate().add(refreshDays, 'days').toDate(),
			})
			.where(eq(tokens.id, id));
	}

	deleteByAccessJti(accessJti: string) {
		this.logger.log(`Deleting token with access JTI: ${accessJti}`);
		return this.databaseService
			.delete(tokens)
			.where(eq(tokens.accessJti, accessJti));
	}

	deleteExpiredTokens() {
		const refreshDays = this.getRefreshTokenExpirationDays();
		const deleteBeforeDate = formatDate()
			.subtract(refreshDays, 'days')
			.toDate();

		return this.databaseService
			.delete(tokens)
			.where(lt(tokens.expiresAt, deleteBeforeDate));
	}
}
