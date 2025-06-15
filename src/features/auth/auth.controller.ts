import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from 'src/features/auth/dto/requests/login.request.dto';
import { LoginService } from 'src/features/auth/services/login.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly loginService: LoginService) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() body: LoginRequestDto) {
		return this.loginService.execute(body);
	}
}
