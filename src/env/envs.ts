import { get } from 'env-var';

export function envs() {
	return {
		PORT: get('PORT').required().asPortNumber(),
		CORS_ORIGINS: get('CORS_ORIGINS').required().asString().split(','),
		JWT_ACCESS_TOKEN_SECRET: get('JWT_ACCESS_TOKEN_SECRET')
			.required()
			.asString(),
		JWT_REFRESH_TOKEN_SECRET: get('JWT_REFRESH_TOKEN_SECRET')
			.required()
			.asString(),
		JWT_ACCESS_TOKEN_EXPIRATION: get('JWT_ACCESS_TOKEN_EXPIRATION')
			.required()
			.asString(),
		JWT_REFRESH_TOKEN_EXPIRATION: get('JWT_REFRESH_TOKEN_EXPIRATION')
			.required()
			.asString(),
		DATABASE_URL: get('DATABASE_URL').required().asString(),
	};
}

export type Envs = ReturnType<typeof envs>;
