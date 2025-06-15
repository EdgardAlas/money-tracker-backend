import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/features/auth/entities/logged-user.entity';

export const ROLES_DECORATOR_NAME = 'permissions';

export const Roles = (...args: Role[]) =>
	SetMetadata(ROLES_DECORATOR_NAME, args);
