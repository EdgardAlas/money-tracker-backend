import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { accounts } from 'src/database/schema';

@Injectable()
export class DeleteAccountService implements BaseService<void> {
	private readonly logger = new Logger(DeleteAccountService.name);

	constructor(
		@Inject(DatabaseService)
		private readonly databaseService: DatabaseService,
	) {}

	async execute(accountId: string, userId: string): Promise<void> {
		const [accountExists] = await this.databaseService
			.select({
				id: accounts.id,
			})
			.from(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));

		if (!accountExists) {
			this.logger.warn(
				`User with ID ${userId} attempted to delete account with ID ${accountId}, but it does not exist or they do not have permission.`,
			);

			throw new NotFoundException(
				'Account not found or you do not have permission to delete it.',
			);
		}

		await this.databaseService
			.delete(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));

		return;
	}
}
