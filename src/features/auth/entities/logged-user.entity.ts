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

	public tier: {
		maxBudgets: number;
		maxAccounts: number;
		maxGoals: number;
		maxRecurringTransactions: number;
		maxCategories: number;
	};

	public system: {
		totalAccounts: number;
		totalBudgets: number;
		totalGoals: number;
		recurringTransactions: number;
		totalCategories: number;
	};

	constructor(props: LoggedUserEntity) {
		Object.assign(this, props);
	}
}
