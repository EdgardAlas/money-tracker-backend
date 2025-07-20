import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { verifyLimits } from 'src/common/helpers/verify-limits';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts, lower } from 'src/database/schema';
import { CreateAccountRequestDto } from 'src/features/accounts/dto/requests/create-account.request.dto';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';

@Injectable()
export class CreateAccountService implements BaseService<IdResponseDto> {
	private readonly logger = new Logger(CreateAccountService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(body: CreateAccountRequestDto, user: LoggedUserEntity) {
		verifyLimits({
			max: user.limits.maxAccounts,
			current: user.system.totalAccounts,
			isAllowedMessage:
				'You have reached the maximum number of accounts allowed for your tier.',
			notAllowedMessage: 'You cannot create more accounts at this time.',
		});

		await this.ensureAccountNameIsUnique(body.name, user);

		const [accountCreated] = await this.databaseService
			.insert(accounts)
			.values({
				name: body.name,
				type: body.type as typeof accounts.$inferInsert.type,
				userId: user.id,
			})
			.returning({
				id: accounts.id,
			});

		if (!accountCreated) {
			this.logger.error(
				`Failed to create account for user with ID ${user.id}.`,
			);
			throw new InternalServerErrorException(
				'Failed to create account, please try again later.',
			);
		}

		return new IdResponseDto(accountCreated.id);
	}

	private async ensureAccountNameIsUnique(
		name: string,
		user: LoggedUserEntity,
	) {
		const [existingAccount] = await this.databaseService
			.select({
				id: accounts.id,
			})
			.from(accounts)
			.where(
				and(
					eq(lower(accounts.name), name.toLowerCase()),
					eq(accounts.userId, user.id),
				),
			);

		if (existingAccount) {
			this.logger.warn(
				`User with ID ${user.id} attempted to create an account with a name that already exists: ${name}.`,
			);
			throw new ConflictException(
				`An account with the name "${name}" already exists.`,
			);
		}
	}
}
