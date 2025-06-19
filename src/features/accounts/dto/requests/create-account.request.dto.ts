import { Trim } from '@buka/class-transformer-extra';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAccountRequestDto {
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(50)
	name: string;

	@IsString()
	@IsEnum(['bank', 'credit_card', 'cash'], {
		message: 'Please provide a valid account type',
	})
	type: string;
}
