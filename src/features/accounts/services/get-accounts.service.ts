import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { PaginationRequestDto } from 'src/common/requests/pagination.request.dto';
import { PaginationResponseDto } from 'src/common/responses/pagination.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, withPagination } from 'src/database/schema';
import { AccountResponseDto } from 'src/features/accounts/dto/responses/account.response.dto';
import { TransactionsHelpersService } from 'src/features/transactions/services/transactions-helpers.service';

@Injectable()
export class GetAccountsService
	implements BaseService<PaginationResponseDto<AccountResponseDto>>
{
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
		private readonly transactionsHelpersService: TransactionsHelpersService,
	) {}

	async execute(query: PaginationRequestDto, userId: string) {
		const accountsQuery = this.buildAccountsQuery(query.q, userId);
		const totalCountPromise = this.getTotalCount(query.q, userId);

		const [paginatedQuery, total] = await Promise.all([
			withPagination(accountsQuery.$dynamic(), query.page, query.size),
			totalCountPromise,
		]);

		return new PaginationResponseDto<AccountResponseDto>({
			items: paginatedQuery.map((account) => {
				return new AccountResponseDto({
					id: account.id,
					name: account.name,
					type: account.type as string,
					balance: account.balance,
					income: account.income,
					expense: account.expense,
				});
			}),
			currentPage: query.page,
			pageSize: query.size,
			totalCount: total,
			totalPages: Math.ceil(total / query.size),
		});
	}

	private buildAccountsQuery(search: string, userId: string) {
		const { balanceQuery, expenseQuery, incomeQuery } =
			this.transactionsHelpersService.balanceQueries(userId);

		return this.databaseService
			.select({
				id: accounts.id,
				name: accounts.name,
				type: accounts.type,
				balance: sql<number>`${balanceQuery}`.mapWith(Number),
				income: sql<number>`${incomeQuery}`.mapWith(Number),
				expense: sql<number>`${expenseQuery}`.mapWith(Number),
			})
			.from(accounts)
			.where(
				and(ilike(accounts.name, `%${search}%`), eq(accounts.userId, userId)),
			);
	}

	private getTotalCount(search: string, userId: string) {
		return this.databaseService.$count(
			accounts,
			and(ilike(accounts.name, `%${search}%`), eq(accounts.userId, userId)),
		);
	}
}
