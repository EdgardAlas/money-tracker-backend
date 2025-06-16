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
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6)
	@MaxLength(32)
	password: string;

	@IsString()
	@MinLength(2)
	@MaxLength(32)
	name: string;

	@IsString()
	@MinLength(2)
	@MaxLength(32)
	@Match('password', {
		message: 'Passwords do not match',
	})
	confirmPassword: string;

	@IsString()
	@IsOptional()
	@IsTimeZone()
	timezone: string = 'UTC';
}
