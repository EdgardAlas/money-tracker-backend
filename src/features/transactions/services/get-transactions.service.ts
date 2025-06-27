import { Inject, Injectable } from '@nestjs/common';
import { and, between, eq, gte, ilike, SQL } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, categories, goals, transactions } from 'src/database/schema';
import { GetTransactionsRequestDto } from 'src/features/transactions/dto/requests/get-transactions.request.dto';

@Injectable()
export class GetTransactionsService {
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async getTransactions(query: GetTransactionsRequestDto, userId: string) {
		const filters: SQL[] = [];

		if (query.startDate && query.endDate) {
			filters.push(
				between(
					transactions.date,
					new Date(query.startDate),
					new Date(query.endDate),
				),
			);
		}

		if (query.startDate && !query.endDate) {
			filters.push(gte(transactions.date, new Date(query.startDate)));
		}

		if (query.endDate && !query.startDate) {
			filters.push(
				between(transactions.date, new Date(0), new Date(query.endDate)),
			);
		}

		// TODO: Implement category filter

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
			.where(and(eq(transactions.userId, userId), ...filters));

		const total = transactionsResult.reduce(
			(acc, transaction) => acc + transaction.amount,
			0,
		);

		// TODO: Implement pagination and DTO
		return {
			transactions: transactionsResult,
			total,
		};
	}
}
