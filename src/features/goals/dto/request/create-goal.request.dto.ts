import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateGoalRequestDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Min(1, { message: 'Target amount must be greater than 0' })
	targetAmount: number;

	@IsString()
	@IsOptional()
	@IsDateString()
	dueDate: string;
}
