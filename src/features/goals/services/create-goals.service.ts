import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { IdResponseDto } from 'src/common/responses/id.response.dto';
import { DatabaseService } from 'src/database/database.provider';
import { goals, lower } from 'src/database/schema';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';
import { CreateGoalRequestDto } from 'src/features/goals/dto/request/create-goal.request.dto';
import { formatDate } from 'src/lib/format-dates';

@Injectable()
export class CreateGoalsService implements BaseService<IdResponseDto> {
	private readonly logger = new Logger(CreateGoalsService.name);

	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(body: CreateGoalRequestDto, user: LoggedUserEntity) {
		this.ensureUserCanCreateGoal(user);

		await this.goalExists(body.name, user.id);

		const [goal] = await this.databaseService
			.insert(goals)
			.values({
				name: body.name,
				targetAmount: body.targetAmount,
				dueDate: body.dueDate ? formatDate(body.dueDate).toDate() : null,
				userId: user.id,
			})
			.returning({ id: goals.id });

		if (!goal) {
			throw new InternalServerErrorException('Goal creation failed');
		}

		return new IdResponseDto(goal.id);
	}

	private async goalExists(name: string, userId: string) {
		const [existingGoal] = await this.databaseService
			.select({ id: goals.id })
			.from(goals)
			.where(
				and(
					eq(lower(goals.name), name.toLocaleLowerCase()),
					eq(goals.userId, userId),
				),
			);

		if (existingGoal) {
			throw new ConflictException(`Goal with this name already exists`);
		}
	}

	private ensureUserCanCreateGoal(user: LoggedUserEntity) {
		if (user.tier.maxGoals <= user.system.totalGoals) {
			this.logger.warn(
				`User with ID ${user.id} has reached the maximum number of goals allowed by their tier.`,
			);
			throw new ConflictException(
				'You have reached the maximum number of goals allowed by your tier.',
			);
		}
	}
}
