import { get } from 'env-var';

export function envs() {
	return {
		PORT: get('PORT').required().asPortNumber(),
		CORS_ORIGINS: get('CORS_ORIGINS').required().asString().split(','),
	};
}

export type Envs = ReturnType<typeof envs>;
