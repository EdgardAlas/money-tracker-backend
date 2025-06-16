import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { ProfileResponseDto } from 'src/features/auth/dto/responses/profile.response.dto';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';

@Injectable()
export class ProfileService implements BaseService<ProfileResponseDto> {
	execute(user: LoggedUserEntity) {
		return new ProfileResponseDto({
			email: user.email,
			id: user.id,
			name: user.name,
			type: user.role,
		});
	}
}
