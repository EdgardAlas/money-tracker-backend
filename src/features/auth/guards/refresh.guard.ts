import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RefreshGuard extends AuthGuard('refresh-strategy') {
	private readonly logger = new Logger(RefreshGuard.name);

	constructor() {
		super({
			property: 'refreshToken',
		});
	}
}
