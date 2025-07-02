import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { accounts } from 'src/database/schema';
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
		const { balanceQuery, expenseQuery, incomeQuery } =
			this.transactionsHelpersService.balanceQueries(userId);

		const [account] = await this.databaseService
			.select({
				id: accounts.id,
				name: accounts.name,
				type: accounts.type,
				balance: balanceQuery.amout,
				income: incomeQuery.amount,
				expense: expenseQuery.amount,
			})
			.from(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));

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
