import { Split } from '@buka/class-transformer-extra';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetTransactionsRequestDto {
	@IsDateString()
	@IsOptional()
	startDate: string = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		1,
		0,
		0,
		0,
		0,
	).toISOString();

	@IsDateString()
	@IsOptional()
	endDate: string = new Date().toISOString();

	@IsString()
	@IsOptional()
	@Split(',')
	category: string[];

	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	account: string;
}
