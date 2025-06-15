import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';

export const GetUser = createParamDecorator(
	(data: keyof LoggedUserEntity, ctx: ExecutionContext) => {
		const request: Express.Request = ctx.switchToHttp().getRequest();

		const user = request.user as LoggedUserEntity;

		if (data) {
			return user[data];
		}

		return user;
	},
);
