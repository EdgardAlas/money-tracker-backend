import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';
import { CreateGoalRequestDto } from 'src/features/goals/dto/request/create-goal.request.dto';
import { CreateGoalsService } from 'src/features/goals/services/create-goals.service';
import { GetGoalsService } from 'src/features/goals/services/get-goals.service';

@Controller('goals')
@Auth()
export class GoalsController {
	constructor(
		private readonly getGoalsService: GetGoalsService,
		private readonly createGoalsService: CreateGoalsService,
	) {}

	@Get()
	getGoals(@User('id') userId: string) {
		return this.getGoalsService.execute(userId);
	}

	@Post()
	createGoal(
		@User() userId: LoggedUserEntity,
		@Body() body: CreateGoalRequestDto,
	) {
		return this.createGoalsService.execute(body, userId);
	}
}
