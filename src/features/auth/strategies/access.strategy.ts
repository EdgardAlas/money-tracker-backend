import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { and, eq, isNull } from 'drizzle-orm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.provider';
import {
	accounts,
	budgets,
	categories,
	goals,
	recurringTransactions,
	tiers,
	tokens,
	users,
} from 'src/database/schema';

import { EnvService } from 'src/env/services/env.service';
import {
	LoggedUserEntity,
	Role,
} from 'src/features/auth/entities/logged-user.entity';

@Injectable()
export class AccessStrategy extends PassportStrategy(
	Strategy,
	'access-strategy',
) {
	private readonly logger = new Logger(AccessStrategy.name);
	constructor(
		private readonly envService: EnvService,
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: envService.get('JWT_ACCESS_TOKEN_SECRET'),
		});
	}

	async validate(payload: { sub: string; jti: string }) {
		const { sub, jti } = payload;

		this.logger.debug(
			`Validating access token for user ID: ${sub}, jti: ${jti}`,
		);

		const user = await this.findUserWithToken(sub, jti);

		this.logger.debug(
			`User found: ${user ? JSON.stringify(user) : 'No user found'}`,
		);

		if (!user) {
			this.logger.warn(
				`Access token validation failed for user ID: ${sub}, jti: ${jti}`,
			);
			throw new BadRequestException('The credentials provided are not valid.');
		}

		return new LoggedUserEntity({
			id: user.id,
			email: user.email,
			name: user.name || '',
			role: user.role.toString() as Role,
			jti,
			limits: user.tier,
			system: user.system,
			timezone: user.timezone || 'UTC',
		});
	}

	private async findUserWithToken(sub: string, jti: string) {
		const [user] = await this.databaseService
			.select({
				id: users.id,
				email: users.email,
				name: users.name,
				role: users.role,
				timezone: users.timezone,
				tier: {
					maxBudgets: tiers.maxBudgets,
					maxAccounts: tiers.maxAccounts,
					maxGoals: tiers.maxGoals,
					maxRecurringTransactions: tiers.maxRecurringTransactions,
					maxCategories: tiers.maxCategories,
				},
				system: {
					totalAccounts: this.databaseService.$count(
						accounts,
						eq(accounts.userId, sub),
					),
					totalBudgets: this.databaseService.$count(
						budgets,
						eq(budgets.userId, sub),
					),
					totalGoals: this.databaseService.$count(goals, eq(goals.userId, sub)),
					totalCategories: this.databaseService.$count(
						categories,
						and(eq(categories.userId, sub), isNull(categories.userId)),
					),
					recurringTransactions: this.databaseService.$count(
						recurringTransactions,
						eq(recurringTransactions.userId, sub),
					),
				},
			})
			.from(users)
			.innerJoin(tokens, eq(tokens.userId, users.id))
			.innerJoin(tiers, eq(tiers.id, users.tierId))
			.where(and(eq(users.id, sub), eq(tokens.accessJti, jti)));

		return user;
	}
}
