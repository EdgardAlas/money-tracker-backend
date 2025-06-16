import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/env/database/database.provider';
import { lower, tiers, users } from 'src/env/database/schema';
import { RegisterRequestDto } from 'src/features/auth/dto/requests/register.request.dto';

@Injectable()
export class RegisterService implements BaseService<void> {
	private readonly logger = new Logger(RegisterService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(body: RegisterRequestDto) {
		const userExistsPromise = this.databaseService
			.select({
				exists: sql<number>`1`.as('exists'),
			})
			.from(users)
			.where(eq(lower(users.email), body.email.toLowerCase()));

		const defaultTierPromise = this.databaseService
			.select({
				id: tiers.id,
			})
			.from(tiers)
			.where(eq(tiers.isDefault, true));

		const [[userExists], [defaultTier]] = await Promise.all([
			userExistsPromise,
			defaultTierPromise,
		]);

		if (userExists) {
			this.logger.warn(`User with email ${body.email} already exists.`);
			throw new BadRequestException('User with this email already exists');
		}

		if (!defaultTier) {
			this.logger.error(
				'Default tier not found. Please ensure that the default tier is configured in the database.',
			);

			throw new BadRequestException(
				'There is a problem configuring your account. Please try again later.',
			);
		}

		await this.databaseService.insert(users).values({
			email: body.email.toLowerCase(),
			password: await hash(body.password, 12),
			name: body.name,
			timezone: body.timezone,
			tierId: defaultTier.id,
		});
	}
}
