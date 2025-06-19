import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { accounts } from 'src/database/schema';
import { CreateAccountRequestDto } from 'src/features/accounts/dto/requests/create-account.request.dto';

@Injectable()
export class CreateAccountService implements BaseService<IdResponseDto> {
	private readonly logger = new Logger(CreateAccountService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(body: CreateAccountRequestDto, userId: string) {
		const [accountCreated] = await this.databaseService
			.insert(accounts)
			.values({
				name: body.name,
				type: body.type as typeof accounts.$inferInsert.type,
				userId: userId,
			})
			.returning({
				id: accounts.id,
			});

		if (!accountCreated) {
			this.logger.error(`Failed to create account for user with ID ${userId}.`);
			throw new InternalServerErrorException(
				'Failed to create account, please try again later.',
			);
		}

		return new IdResponseDto(accountCreated.id);
	}
}
