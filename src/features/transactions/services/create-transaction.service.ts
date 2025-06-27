import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { and, eq, isNull, or } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, categories, transactions } from 'src/database/schema';
import { CreateTransactionRequestDto } from 'src/features/transactions/dto/requests/create-transaction.request.dto';
import { formatDate } from 'src/lib/format-dates';

@Injectable()
export class CreateTransactionService implements BaseService<IdResponseDto> {
	private logger = new Logger(CreateTransactionService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(body: CreateTransactionRequestDto, userId: string) {
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
			return this.createTransactionIfAccountIsProvided(body, userId);
		}

		if (body.goalId) {
			this.logger.log(
				`Creating transaction for goalId: ${body.goalId}, userId: ${userId}`,
			);
			return this.createTransactionIfGoalIsProvided(body, userId);
		}

		return this.createTransactionIfGoalIsProvided(body, userId);
	}

	private async createTransactionIfAccountIsProvided(
		body: CreateTransactionRequestDto,
		userId: string,
	) {
		const [accountExists, categoryExists] = await Promise.all([
			this.databaseService
				.select({
					id: accounts.id,
				})
				.from(accounts)
				.where(
					and(eq(accounts.id, body.accountId), eq(accounts.userId, userId)),
				)
				.then((results) => results[0]),
			this.verifyIfCategoryExists(body, userId),
		]);

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

		const [transactionCreated] = await this.databaseService
			.insert(transactions)
			.values({
				accountId: body.accountId,
				categoryId: body.categoryId,
				date: formatDate(body.date).toDate(),
				amount:
					body.type === 'income'
						? Math.abs(body.amount)
						: -Math.abs(body.amount),
				type: body.type as (typeof transactions.$inferInsert)['type'],
				note: body.note,
				userId: userId,
			})
			.returning({
				id: accounts.id,
			});

		if (!transactionCreated) {
			throw new InternalServerErrorException(`Failed to create transaction`);
		}

		return new IdResponseDto(transactionCreated.id);
	}

	private async createTransactionIfGoalIsProvided(
		body: CreateTransactionRequestDto,
		userId: string,
	) {
		const [categoryExists] = await Promise.all([
			this.verifyIfCategoryExists(body, userId),
			this.databaseService
				.select({
					id: accounts.id,
				})
				.from(accounts)
				.where(and(eq(accounts.id, body.goalId), eq(accounts.userId, userId)))
				.then((results) => results[0]),
		]);

		if (!categoryExists) {
			throw new NotFoundException(
				`This category does not exist or does not belong to you.`,
			);
		}

		const [transactionCreated] = await this.databaseService
			.insert(transactions)
			.values({
				accountId: null,
				categoryId: body.categoryId,
				date: formatDate(body.date).toDate(),
				amount:
					body.type === 'income'
						? Math.abs(body.amount)
						: -Math.abs(body.amount),
				type: body.type as (typeof transactions.$inferInsert)['type'],
				note: body.note,
				userId: userId,
			})
			.returning({
				id: accounts.id,
			});

		if (!transactionCreated) {
			throw new InternalServerErrorException(`Failed to create transaction`);
		}

		return new IdResponseDto(transactionCreated.id);
	}

	private async verifyIfCategoryExists(
		body: CreateTransactionRequestDto,
		userId: string,
	) {
		if (!body.categoryId) {
			return true;
		}

		const [categoryExists] = await this.databaseService
			.select({
				id: categories.id,
			})
			.from(categories)
			.where(
				or(
					and(
						eq(categories.id, body.categoryId),
						eq(categories.userId, userId),
					),
					isNull(categories.userId),
				),
			);

		if (!categoryExists) {
			throw new NotFoundException(
				`This category does not exist or does not belong to you.`,
			);
		}

		return !!categoryExists;
	}
}
