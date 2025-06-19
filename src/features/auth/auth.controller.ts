import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RefreshToken } from 'src/common/decorators/refresh-token.decorator';
import { Refresh } from 'src/common/decorators/refresh.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { LoginRequestDto } from './dto/requests/login.request.dto';
import { RegisterRequestDto } from './dto/requests/register.request.dto';
import { LoggedUserEntity } from './entities/logged-user.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { ProfileService } from './services/profile.service';
import { RefreshService } from './services/refresh.service';
import { RegisterService } from './services/register.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly loginService: LoginService,
		private readonly profileService: ProfileService,
		private readonly logoutService: LogoutService,
		private readonly refreshService: RefreshService,
		private readonly registerService: RegisterService,
	) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() body: LoginRequestDto) {
		return this.loginService.execute(body);
	}

	@Auth()
	@Get('profile')
	profile(@GetUser() user: LoggedUserEntity) {
		return this.profileService.execute(user);
	}

	@Auth()
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	logout(@GetUser() user: LoggedUserEntity) {
		return this.logoutService.execute(user);
	}

	@Refresh()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	refresh(@RefreshToken() refreshToken: RefreshTokenEntity) {
		return this.refreshService.execute(refreshToken);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	register(@Body() body: RegisterRequestDto) {
		return this.registerService.execute(body);
	}
}
