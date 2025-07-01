import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, transactions } from 'src/database/schema';
import { UpdateTransactionRequestDto } from 'src/features/transactions/dto/requests/update-transaction.request.dto';
import { TransactionsHelpersService } from 'src/features/transactions/services/transactions-helpers.service';
import { formatDate } from 'src/lib/format-dates';

@Injectable()
export class UpdateTransactionService {
	private logger = new Logger(UpdateTransactionService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
		private readonly transactionsHelpersService: TransactionsHelpersService,
	) {}

	async execute(
		transactionId: string,
		body: UpdateTransactionRequestDto,
		userId: string,
	) {
		if (body.accountId && body.goalId) {
			this.logger.error(
				`Both accountId and goalId provided: accountId: ${body.accountId}, goalId: ${body.goalId}`,
			);

			throw new ConflictException(
				`You cannot provide both account and goal at the same time.`,
			);
		}

		if (body.accountId) {
			this.logger.log(
				`Creating transaction for accountId: ${body.accountId}, userId: ${userId}`,
			);
			return this.createTransactionIfAccountIsProvided(
				transactionId,
				body,
				userId,
			);
		}

		if (body.goalId) {
			this.logger.log(
				`Creating transaction for goalId: ${body.goalId}, userId: ${userId}`,
			);
			return this.createTransactionIfGoalIsProvided(
				transactionId,
				body,
				userId,
			);
		}
	}

	private async createTransactionIfAccountIsProvided(
		transactionId: string,
		body: UpdateTransactionRequestDto,
		userId: string,
	) {
		const [accountExists, categoryExists, transactionExists] =
			await Promise.all([
				this.transactionsHelpersService.verifyIfAccountExists(
					body.accountId,
					userId,
				),
				this.transactionsHelpersService.verifyIfCategoryExists(
					body.categoryId,
					userId,
				),
				this.transactionsHelpersService.verifyIfTransactionExists(
					transactionId,
					userId,
				),
			]);

		if (!transactionExists) {
			throw new NotFoundException(
				`This transaction does not exist or does not belong to you.`,
			);
		}

		if (!accountExists) {
			throw new NotFoundException(
				`This account does not exist or does not belong to you.`,
			);
		}

		if (!categoryExists) {
			throw new NotFoundException(
				`This category does not exist or does not belong to you.`,
			);
		}

		const [transactionUpdated] = await this.databaseService
			.update(transactions)
			.set({
				title: body.title,
				accountId: body.accountId,
				categoryId: body.categoryId,
				date: formatDate(body.date).toDate(),
				amount:
					body.amount !== undefined
						? body.type === 'income'
							? Math.abs(body.amount)
							: -Math.abs(body.amount)
						: undefined,
				type: body.type as (typeof transactions.$inferInsert)['type'],
				note: body.note,
			})
			.where(eq(transactions.id, transactionId))
			.returning({
				id: accounts.id,
			});

		if (!transactionUpdated) {
			throw new InternalServerErrorException(`Failed to update transaction`);
		}

		return new IdResponseDto(transactionUpdated.id);
	}

	private async createTransactionIfGoalIsProvided(
		transactionId: string,
		body: UpdateTransactionRequestDto,
		userId: string,
	) {
		const [categoryExists, goalExists, transactionExists] = await Promise.all([
			this.transactionsHelpersService.verifyIfCategoryExists(
				body.categoryId,
				userId,
			),
			this.transactionsHelpersService.verifyIfGoalExists(body.goalId, userId),
			this.transactionsHelpersService.verifyIfTransactionExists(
				transactionId,
				userId,
			),
		]);

		if (!transactionExists) {
			throw new NotFoundException(
				`This transaction does not exist or does not belong to you.`,
			);
		}

		if (!categoryExists) {
			throw new NotFoundException(
				`This category does not exist or does not belong to you.`,
			);
		}

		if (!goalExists) {
			throw new NotFoundException(
				`This goal does not exist or does not belong to you.`,
			);
		}

		const [transactionUpdated] = await this.databaseService
			.update(transactions)
			.set({
				title: body.title,
				goalId: body.goalId,
				categoryId: body.categoryId,
				date: formatDate(body.date).toDate(),
				amount:
					body.amount !== undefined
						? body.type === 'income'
							? Math.abs(body.amount)
							: -Math.abs(body.amount)
						: undefined,
				type: body.type as (typeof transactions.$inferInsert)['type'],
				note: body.note,
			})
			.where(eq(transactions.id, transactionId))
			.returning({
				id: accounts.id,
			});

		if (!transactionUpdated) {
			throw new InternalServerErrorException(`Failed to update transaction`);
		}

		return new IdResponseDto(transactionUpdated.id);
	}
}
