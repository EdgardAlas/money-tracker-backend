import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { transactions } from 'src/database/schema';
import { TransactionsHelpersService } from 'src/features/transactions/services/transactions-helpers.service';

@Injectable()
export class DeleteTransactionService implements BaseService<void> {
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
		private readonly transactionsHelpersService: TransactionsHelpersService,
	) {}

	async execute(transactionId: string, userId: string): Promise<void> {
		await this.transactionsHelpersService.verifyIfTransactionBelongsToUser(
			transactionId,
			userId,
		);

		await this.databaseService
			.delete(transactions)
			.where(
				and(
					eq(transactions.id, transactionId),
					eq(transactions.userId, userId),
				),
			)
			.execute();

		return;
	}
}
