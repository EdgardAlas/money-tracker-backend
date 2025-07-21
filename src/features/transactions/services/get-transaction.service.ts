import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import {
	accounts,
	categories,
	goals,
	transactions,
	users,
} from 'src/database/schema';
import { TransactionResponseDto } from 'src/features/transactions/dto/responses/transaction.response.dto';

@Injectable()
export class GetTransactionService
	implements BaseService<TransactionResponseDto>
{
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(transactionId: string, userId: string) {
		const [transactionsResult] = await this.databaseService
			.select({
				id: transactions.id,
				account: accounts.name,
				category: categories.name,
				goal: goals.name,
				amount: transactions.amount,
				type: transactions.type,
				date: sql<Date>`(${transactions.date} AT TIME ZONE 'UTC' AT TIME ZONE ${users.timezone})`,
				note: transactions.note,
				title: transactions.title,
			})
			.from(transactions)
			.leftJoin(categories, eq(transactions.categoryId, categories.id))
			.leftJoin(accounts, eq(transactions.accountId, accounts.id))
			.leftJoin(goals, eq(transactions.goalId, goals.id))
			.innerJoin(users, eq(transactions.userId, users.id))
			.where(
				and(
					eq(transactions.userId, userId),
					eq(transactions.id, transactionId),
				),
			);

		if (!transactionsResult) {
			throw new NotFoundException(
				"This transaction doesn't exist or you don't have permission to access it.",
			);
		}

		return new TransactionResponseDto(transactionsResult);
	}
}
