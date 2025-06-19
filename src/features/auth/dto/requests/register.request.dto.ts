import { Trim } from '@buka/class-transformer-extra';
import {
	IsEmail,
	IsOptional,
	IsString,
	IsTimeZone,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Match } from 'src/common/validators/match';

export class RegisterRequestDto {
	@IsString()
	@Trim()
	@IsEmail()
	email: string;

	@IsString()
	@Trim()
	@MinLength(6)
	@MaxLength(32)
	password: string;

	@IsString()
	@Trim()
	@MinLength(2)
	@MaxLength(32)
	name: string;

	@IsString()
	@Trim()
	@MinLength(2)
	@MaxLength(32)
	@Match('password', {
		message: 'Passwords do not match',
	})
	confirmPassword: string;

	@IsString()
	@Trim()
	@IsOptional()
	@IsTimeZone()
	timezone: string = 'UTC';
}
