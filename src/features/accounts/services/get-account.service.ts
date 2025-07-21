import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, transactions } from 'src/database/schema';
import { AccountResponseDto } from 'src/features/accounts/dto/responses/account.response.dto';
import { TransactionsHelpersService } from 'src/features/transactions/services/transactions-helpers.service';

@Injectable()
export class GetAccountService implements BaseService<AccountResponseDto> {
	private readonly logger = new Logger(GetAccountService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
		private readonly transactionsHelpersService: TransactionsHelpersService,
	) {}

	async execute(
		accountId: string,
		userId: string,
	): Promise<AccountResponseDto> {
		const [account] = await this.databaseService
			.select({
				id: accounts.id,
				name: accounts.name,
				type: accounts.type,
				balance: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`.mapWith(
					Number,
				),
				income: sql<number | null>`
					SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END)
				`.mapWith(Number),
				expense: sql<number | null>`
					SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END)
				`.mapWith(Number),
			})
			.from(accounts)
			.leftJoin(transactions, eq(transactions.accountId, accounts.id))
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
			.groupBy(accounts.id, accounts.name, accounts.type, accounts.userId);

		if (!account) {
			this.logger.warn(
				`User with ID ${userId} attempted to access account with ID ${accountId}, but it does not exist or they do not have permission.`,
			);

			throw new NotFoundException(
				'Account not found or you do not have permission to access it.',
			);
		}

		return new AccountResponseDto({
			id: account.id,
			name: account.name,
			type: account.type as string,
			balance: account.balance,
			income: account.income,
			expense: account.expense,
		});
	}
}
