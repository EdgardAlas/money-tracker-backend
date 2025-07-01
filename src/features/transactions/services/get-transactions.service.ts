import { Inject, Injectable } from '@nestjs/common';
import { and, between, eq, gte, ilike, or, SQL } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, categories, goals, transactions } from 'src/database/schema';
import { GetTransactionsRequestDto } from 'src/features/transactions/dto/requests/get-transactions.request.dto';
import { TransactionResponseDto } from 'src/features/transactions/dto/responses/transaction.response.dto';
import { formatDate } from 'src/lib/format-dates';

@Injectable()
export class GetTransactionsService
	implements BaseService<TransactionResponseDto>
{
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(query: GetTransactionsRequestDto, userId: string) {
		const filters: SQL[] = [];

		if (query.startDate && query.endDate) {
			filters.push(
				between(
					transactions.date,
					formatDate(query.startDate).utc().toDate(),
					formatDate(query.endDate).utc().toDate(),
				),
			);
		}

		if (query.startDate && !query.endDate) {
			filters.push(
				gte(transactions.date, formatDate(query.startDate).utc().toDate()),
			);
		}

		if (query.endDate && !query.startDate) {
			filters.push(
				between(
					transactions.date,
					new Date(0),
					formatDate(query.endDate).utc().toDate(),
				),
			);
		}

		if (query.title) {
			filters.push(ilike(transactions.title, `%${query.title}%`));
		}

		const transactionsResult = await this.databaseService
			.select({
				id: transactions.id,
				account: accounts.name,
				category: categories.name,
				goal: goals.name,
				amount: transactions.amount,
				type: transactions.type,
				date: transactions.date,
				note: transactions.note,
				title: transactions.title,
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.leftJoin(accounts, eq(transactions.accountId, accounts.id))
			.leftJoin(goals, eq(transactions.goalId, goals.id))
			.where(
				and(
					eq(transactions.userId, userId),
					...filters,
					query.category.length > 0
						? or(
								...query.category.map((category) =>
									ilike(categories.name, `%${category}%`),
								),
							)
						: undefined,
				),
			);

		const total = transactionsResult.reduce(
			(acc, transaction) => acc + transaction.amount,
			0,
		);

		return new TransactionResponseDto({
			transactions: transactionsResult,
			total,
		});
	}
}
