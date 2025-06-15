import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
