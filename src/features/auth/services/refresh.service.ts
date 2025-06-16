import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { LoginResponseDto } from 'src/features/auth/dto/responses/login.response.dto';
import { RefreshTokenEntity } from 'src/features/auth/entities/refresh-token.entity';
import { TokensService } from 'src/features/auth/services/tokens.service';
import { v7 } from 'uuid';

@Injectable()
export class RefreshService implements BaseService<LoginResponseDto> {
	constructor(private readonly tokensService: TokensService) {}

	async execute(body: RefreshTokenEntity) {
		const accessJti = v7();
		const refreshJti = v7();

		const { accessToken, refreshToken } = await this.tokensService.refresh(
			body.id,
			body.userId,
			accessJti,
			refreshJti,
		);

		return new LoginResponseDto({
			accessToken,
			refreshToken,
		});
	}
}
