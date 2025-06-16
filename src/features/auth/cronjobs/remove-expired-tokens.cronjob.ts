import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokensService } from 'src/features/auth/services/tokens.service';

@Injectable()
export class RemoveUserloginsCronjob {
	private readonly logger = new Logger(RemoveUserloginsCronjob.name);

	constructor(private readonly tokensService: TokensService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handle() {
		this.logger.debug('Removing refresh tokens...');

		const result = await this.tokensService.deleteExpiredTokens();

		this.logger.debug(`Removed ${result.rowCount} refresh tokens.`);
	}
}
