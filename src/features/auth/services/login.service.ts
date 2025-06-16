import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/env/database/database.provider';
import { users } from 'src/env/database/schema';
import { LoginRequestDto } from 'src/features/auth/dto/requests/login.request.dto';
import { LoginResponseDto } from 'src/features/auth/dto/responses/login.response.dto';
import { TokensService } from 'src/features/auth/services/tokens.service';
import { v7 } from 'uuid';

@Injectable()
export class LoginService implements BaseService<LoginResponseDto> {
	private readonly logger = new Logger(LoginService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
		private readonly tokensService: TokensService,
	) {}

	async execute(body: LoginRequestDto) {
		this.logger.log(`Executing login for user: ${body.email}`);

		const user = await this.findUserByEmail(body.email);

		await this.validatePassword(body.password, user.password, body.email);

		this.logger.log(`User authenticated successfully: ${body.email}`);

		const { accessToken, refreshToken } = await this.generateTokens(user.id);

		return new LoginResponseDto({
			accessToken,
			refreshToken,
		});
	}

	private async findUserByEmail(email: string) {
		const [user] = await this.databaseService
			.select({
				id: users.id,
				password: users.password,
				email: users.email,
			})
			.from(users)
			.where(eq(users.email, email));

		if (!user) {
			this.logger.warn(`User not found: ${email}`);
			throw new NotFoundException('Invalid credentials');
		}
		return user;
	}

	private async validatePassword(
		providedPassword: string,
		storedPassword: string,
		email: string,
	) {
		const isPasswordValid = await compare(providedPassword, storedPassword);

		if (!isPasswordValid) {
			this.logger.warn(`Invalid password for user: ${email}`);
			throw new NotFoundException('Invalid credentials');
		}
	}

	private async generateTokens(userId: string) {
		const accessTokenJti = v7();
		const refreshTokenJti = v7();

		return this.tokensService.insert(userId, accessTokenJti, refreshTokenJti);
	}
}
