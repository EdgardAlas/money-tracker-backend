export type Role = 'user' | 'admin' | 'superadmin';

export enum UserRoles {
	USER = 'user',
	ADMIN = 'admin',
	SUPERADMIN = 'superadmin',
}

export class LoggedUserEntity {
	public id: string;
	public email: string;
	public name: string;
	public role: Role;
	public jti: string;

	constructor(props: LoggedUserEntity) {
		Object.assign(this, props);
	}
}
