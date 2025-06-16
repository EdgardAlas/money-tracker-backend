import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';
import { TokensService } from 'src/features/auth/services/tokens.service';

@Injectable()
export class LogoutService implements BaseService<void> {
	constructor(private readonly tokensService: TokensService) {}

	async execute(user: LoggedUserEntity) {
		await this.tokensService.deleteByAccessJti(user.jti);
	}
}
