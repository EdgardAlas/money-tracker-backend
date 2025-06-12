import { Logger, Provider } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnvService } from 'src/env/services/env.service';
import * as schema from './schema';

export const DatabaseService = 'DatabaseService';
export type DatabaseService = NodePgDatabase<typeof schema>;

export const DatabaseProvider: Provider = {
	provide: DatabaseService,
	inject: [EnvService],
	useFactory: (configService: EnvService) => {
		const logger = new Logger('DatabaseProvider');
		logger.log('Creating database connection pool');
		const connectionString = configService.get('DATABASE_URL');

		const pool = new Pool({
			connectionString,
			max: 20,
			idleTimeoutMillis: 600000, // 30 seconds
			connectionTimeoutMillis: 2000, // 2 seconds
		});

		return drizzle({
			client: pool,
			schema,
			// logger: true,
		});
	},
};
