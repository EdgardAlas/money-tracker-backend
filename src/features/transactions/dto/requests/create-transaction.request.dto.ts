import { Optional } from '@nestjs/common';
import {
	IsDateString,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Min,
} from 'class-validator';

export class CreateTransactionRequestDto {
	@IsString()
	@IsUUID()
	@IsOptional()
	accountId: string;

	@IsString()
	@IsUUID()
	@IsOptional()
	categoryId: string;

	@IsUUID()
	@IsOptional()
	goalId: string;

	@IsNumber()
	@Min(0, {
		message: 'Amount must be a positive number',
	})
	amount: number;

	@IsEnum(['income', 'expense'], {
		message: 'Type must be either "income" or "expense"',
	})
	type: string;

	@IsDateString()
	date: string;

	@IsString()
	@Optional()
	note?: string;
}
