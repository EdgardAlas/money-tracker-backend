import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts } from 'src/database/schema';
import { UpdateAccountRequestDto } from 'src/features/accounts/dto/requests/update-account.request.dto';

@Injectable()
export class UpdateAccountService implements BaseService<IdResponseDto> {
	private readonly logger = new Logger(UpdateAccountService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(
		accountId: string,
		body: UpdateAccountRequestDto,
		userId: string,
	) {
		const [accountExists] = await this.databaseService
			.select({
				id: accounts.id,
			})
			.from(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)));

		if (!accountExists) {
			this.logger.warn(
				`User with ID ${userId} attempted to update account with ID ${accountId}, but it does not exist or they do not have permission.`,
			);
			throw new NotFoundException(
				`Account not found or you do not have permission to update it.`,
			);
		}

		const [accountUpdated] = await this.databaseService
			.update(accounts)
			.set({
				name: body.name,
				type: body.type as typeof accounts.$inferInsert.type,
			})
			.where(eq(accounts.id, accountId))
			.returning({
				id: accounts.id,
			});

		if (!accountUpdated) {
			this.logger.error(
				`Failed to update account with ID ${accountId} for user with ID ${userId}.`,
			);
			throw new InternalServerErrorException(
				'Failed to update account, please try again later.',
			);
		}

		return new IdResponseDto(accountUpdated.id);
	}
}
