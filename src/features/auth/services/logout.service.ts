import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/env/database/database.provider';
import { tokens } from 'src/env/database/schema';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';

@Injectable()
export class LogoutService implements BaseService<void> {
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(user: LoggedUserEntity) {
		await this.databaseService
			.delete(tokens)
			.where(eq(tokens.accessJti, user.jti));
	}
}
