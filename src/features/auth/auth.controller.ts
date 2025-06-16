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
import { LoginRequestDto } from 'src/features/auth/dto/requests/login.request.dto';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';
import { RefreshTokenEntity } from 'src/features/auth/entities/refresh-token.entity';
import { LoginService } from 'src/features/auth/services/login.service';
import { LogoutService } from 'src/features/auth/services/logout.service';
import { ProfileService } from 'src/features/auth/services/profile.service';
import { RefreshService } from 'src/features/auth/services/refresh.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly loginService: LoginService,
		private readonly profileService: ProfileService,
		private readonly logoutService: LogoutService,
		private readonly refreshService: RefreshService,
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
}
