import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { goals, transactions } from 'src/database/schema';
import { GoalResponseDto } from 'src/features/goals/dto/response/goal.response.dto';

@Injectable()
export class GetGoalsService implements BaseService<GoalResponseDto[]> {
	public constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(userId: string) {
		const result = await this.databaseService
			.select({
				id: goals.id,
				name: goals.name,
				targetAmount: goals.targetAmount,
				dueDate: goals.dueDate,
				currentAmount:
					sql<number>`COALESCE(SUM(${transactions.amount}), 0)`.mapWith(Number),
				totalIncome: sql<number | null>`
      SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END)
    `.mapWith(Number),
				totalExpense: sql<number | null>`
      SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END)
    `.mapWith(Number),
			})
			.from(goals)
			.leftJoin(transactions, eq(transactions.goalId, goals.id))
			.where(and(eq(goals.userId, userId)))
			.groupBy(goals.id, goals.name, goals.targetAmount, goals.dueDate);

		const goalsResponse = result.map(
			(goal) =>
				new GoalResponseDto({
					currentAmount: goal.currentAmount,
					dueDate: (goal.dueDate?.toISOString() as string) || null,
					id: goal.id,
					name: goal.name,
					target: goal.targetAmount,
					income: goal.totalIncome,
					expense: goal.totalExpense,
				}),
		);

		return goalsResponse;
	}
}
