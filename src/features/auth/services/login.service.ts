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

		const [user] = await this.databaseService
			.select()
			.from(users)
			.where(eq(users.email, body.email));

		if (!user) {
			this.logger.warn(`User not found: ${body.email}`);
			throw new NotFoundException('Invalid credentials');
		}

		const isPasswordValid = await compare(body.password, user.password);

		if (!isPasswordValid) {
			this.logger.warn(`Invalid password for user: ${body.email}`);
			throw new NotFoundException('Invalid credentials');
		}

		this.logger.log(`User authenticated successfully: ${body.email}`);

		const accessTokenJti = v7();
		const refreshTokenJti = v7();

		const { accessToken, refreshToken } = await this.tokensService.insert(
			user.id,
			accessTokenJti,
			refreshTokenJti,
		);

		return new LoginResponseDto({
			accessToken,
			refreshToken,
		});
	}
}
