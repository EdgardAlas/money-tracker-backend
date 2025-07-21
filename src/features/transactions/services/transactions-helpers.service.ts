import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNull, or } from 'drizzle-orm';
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

	async verifyIfTransactionBelongsToUser(
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

		if (!transactionExists) {
			throw new NotFoundException(
				"This transaction doesn't exist or you don't have permission to access it.",
			);
		}

		return !!transactionExists;
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
}
