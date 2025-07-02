import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, categories, goals, transactions } from 'src/database/schema';

@Injectable()
export class TransactionsHelpersService {
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async verifyIfCategoryExists(categoryId: string | undefined, userId: string) {
		if (!categoryId) {
			return true;
		}

		const [categoryExists] = await this.databaseService
			.select({
				id: categories.id,
			})
			.from(categories)
			.where(
				or(
					and(eq(categories.id, categoryId), eq(categories.userId, userId)),
					isNull(categories.userId),
				),
			);

		return !!categoryExists;
	}

	async verifyIfAccountExists(accountId: string | undefined, userId: string) {
		if (!accountId) {
			return false;
		}
		const [accountExists] = await this.databaseService
			.select({
				id: accounts.id,
			})
			.from(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));
		return !!accountExists;
	}

	async verifyIfGoalExists(goalId: string | undefined, userId: string) {
		if (!goalId) {
			return false;
		}
		const [goalExists] = await this.databaseService
			.select({
				id: goals.id,
			})
			.from(goals)
			.where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
		return !!goalExists;
	}

	async verifyIfTransactionExists(
		transactionId: string | undefined,
		userId: string,
	) {
		if (!transactionId) {
			return false;
		}
		const [transactionExists] = await this.databaseService
			.select({
				id: transactions.id,
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.id, transactionId),
					eq(transactions.userId, userId),
				),
			);
		return !!transactionExists;
	}

	balanceQueries(userId: string) {
		const balanceQuery = this.databaseService
			.select({
				balance: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
					.mapWith(Number)
					.as('balance'),
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.accountId, accounts.id),
					eq(transactions.userId, userId),
				),
			)
			.as('balance');

		const incomeQuery = this.databaseService
			.select({
				income: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
					.mapWith(Number)
					.as('income'),
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.accountId, accounts.id),
					eq(transactions.userId, userId),
					eq(transactions.type, 'income'),
				),
			)
			.as('income');

		const expenseQuery = this.databaseService
			.select({
				expense: sql<number>`ABS(COALESCE(SUM(${transactions.amount}), 0))`
					.mapWith(Number)
					.as('expense'),
			})
			.from(transactions)
			.where(
				and(
					eq(transactions.accountId, accounts.id),
					eq(transactions.userId, userId),
					eq(transactions.type, 'expense'),
				),
			)
			.as('expense');

		return {
			balanceQuery,
			incomeQuery,
			expenseQuery,
		};
	}
}
