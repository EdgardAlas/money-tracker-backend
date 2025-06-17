import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';

import { PermissionsGuard } from 'src/common/decorators/roles.guard';
import { UserRoles } from 'src/features/auth/entities/logged-user.entity';
import { AccessGuard } from 'src/features/auth/guards/jwt.guard';

export const Auth = (...roles: UserRoles[]) =>
	applyDecorators(Roles(...roles), UseGuards(AccessGuard, PermissionsGuard));
