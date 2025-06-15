import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { LoginRequestDto } from 'src/features/auth/dto/requests/login.request.dto';
import { LoginResponseDto } from 'src/features/auth/dto/responses/login.response.dto';

@Injectable()
export class LoginService implements BaseService<LoginResponseDto> {
	private readonly logger = new Logger(LoginService.name);

	execute(body: LoginRequestDto) {
		this.logger.log(`Executing login for user: ${body.email}`);

		return new LoginResponseDto({
			accessToken: 'mocked-access-token',
			refreshToken: 'mocked-refresh-token',
		});
	}
}
