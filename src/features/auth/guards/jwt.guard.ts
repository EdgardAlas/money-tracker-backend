import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AccessGuard extends AuthGuard('access-strategy') {
	private readonly logger = new Logger(AccessGuard.name);
}
