import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenEntity } from 'src/features/auth/entities/refresh-token.entity';

export const RefreshToken = createParamDecorator(
	(data: keyof RefreshTokenEntity, ctx: ExecutionContext) => {
		const request: Express.Request = ctx.switchToHttp().getRequest();

		if (data) {
			// @ts-expect-error - Property 'refreshToken' does not exist on type 'Request'.
			return (request.refreshToken as RefreshTokenEntity)[data];
		}

		// @ts-expect-error - Property 'refreshToken' does not exist on type 'Request'.
		return request.refreshToken as string;
	},
);
