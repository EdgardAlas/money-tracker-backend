import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_DECORATOR_NAME } from 'src/common/decorators/permissions.decorator';
import {
	LoggedUserEntity,
	UserRoles,
} from 'src/features/auth/entities/logged-user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<string[]>(
			ROLES_DECORATOR_NAME,
			context.getHandler(),
		);

		const request: Express.Request = context.switchToHttp().getRequest();

		const user = request.user as LoggedUserEntity;

		if (!roles) {
			return true;
		}

		if (roles.length === 0) {
			return true;
		}

		if (!user) {
			throw new BadRequestException('User not authenticated');
		}

		if (user.role === UserRoles.SUPERADMIN) {
			return true;
		}

		const hasPermission = this.matchRoles(roles, user.role);

		if (!hasPermission) {
			throw new BadRequestException(
				'You do not have permission to access this resource',
			);
		}

		return hasPermission;
	}

	matchRoles(roles: string[], userRole: string): boolean {
		return roles.includes(userRole);
	}
}
