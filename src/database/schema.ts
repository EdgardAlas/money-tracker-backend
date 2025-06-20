import {
	pgTable,
	unique,
	uuid,
	text,
	integer,
	timestamp,
	index,
	foreignKey,
	char,
	numeric,
	interval,
	boolean,
	pgEnum,
	AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const accountType = pgEnum('account_type', [
	'bank',
	'credit_card',
	'cash',
]);
export const budgetPeriod = pgEnum('budget_period', [
	'monthly',
	'weekly',
	'yearly',
]);
export const recurringTransactionType = pgEnum('recurring_transaction_type', [
	'income',
	'expense',
]);
export const role = pgEnum('role', ['user', 'admin', 'superadmin']);
export const tokenType = pgEnum('token_type', ['access', 'refresh']);
export const transactionType = pgEnum('transaction_type', [
	'income',
	'expense',
]);
export const userRole = pgEnum('user_role', ['user', 'admin', 'superadmin']);

export const tiers = pgTable(
	'tiers',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		name: text().notNull(),
		maxBudgets: integer('max_budgets').notNull(),
		maxAccounts: integer('max_accounts').notNull(),
		maxGoals: integer('max_goals').notNull(),
		maxRecurringTransactions: integer('max_recurring_transactions').notNull(),
		isDefault: boolean('is_default').default(false),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_tiers_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_tiers_name').using(
			'btree',
			table.name.asc().nullsLast().op('text_ops'),
		),
		unique('tiers_name_key').on(table.name),
	],
);

export const users = pgTable(
	'users',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		email: text().notNull(),
		password: text().notNull(),
		name: text().notNull(),
		tierId: uuid('tier_id').notNull(),
		currency: char({ length: 3 }).default('USD').notNull(),
		timezone: text().default('UTC').notNull(),
		role: role().default('user').notNull(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_users_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_users_email').using(
			'btree',
			table.email.asc().nullsLast().op('text_ops'),
		),
		foreignKey({
			columns: [table.tierId],
			foreignColumns: [tiers.id],
			name: 'users_tier_id_fkey',
		}),
		unique('users_email_key').on(table.email),
	],
);

export const tokens = pgTable(
	'tokens',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id').notNull(),
		accessJti: uuid('access_jti').notNull(),
		refreshJti: uuid('refresh_jti').notNull(),
		expiresAt: timestamp('expires_at', {
			withTimezone: true,
			mode: 'date',
		}).notNull(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_tokens_access_jti').using(
			'btree',
			table.accessJti.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_tokens_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_tokens_refresh_jti').using(
			'btree',
			table.refreshJti.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_tokens_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'tokens_user_id_fkey',
		}),
	],
);

export const accounts = pgTable(
	'accounts',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		name: text().notNull(),
		type: accountType(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_accounts_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_accounts_name_user_id').using(
			'btree',
			table.name.asc().nullsLast().op('uuid_ops'),
			table.userId.asc().nullsLast().op('text_ops'),
		),
		index('idx_accounts_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'accounts_user_id_fkey',
		}).onDelete('cascade'),
	],
);

export const categories = pgTable(
	'categories',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		name: text().notNull(),
		icon: uuid(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_categories_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_categories_name_user_id').using(
			'btree',
			table.name.asc().nullsLast().op('uuid_ops'),
			table.userId.asc().nullsLast().op('text_ops'),
		),
		index('idx_categories_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'categories_user_id_fkey',
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.icon],
			foreignColumns: [icons.id],
			name: 'categories_icon_fkey',
		}).onDelete('set null'),
	],
);

export const icons = pgTable(
	'icons',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		name: text().notNull(),
		url: text().notNull(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_icons_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_icons_name').using(
			'btree',
			table.name.asc().nullsLast().op('text_ops'),
		),
		unique('icons_name_key').on(table.name),
	],
);

export const budgets = pgTable(
	'budgets',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		categoryId: uuid('category_id'),
		amount: numeric({ precision: 12, scale: 2 }).notNull(),
		period: budgetPeriod().notNull(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_budgets_category_id').using(
			'btree',
			table.categoryId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_budgets_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_budgets_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'budgets_user_id_fkey',
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'budgets_category_id_fkey',
		}),
	],
);

export const goals = pgTable(
	'goals',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		name: text().notNull(),
		targetAmount: numeric('target_amount', {
			precision: 12,
			scale: 2,
		}).notNull(),
		dueDate: timestamp('due_date', { withTimezone: true, mode: 'date' }),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_goals_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_goals_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'goals_user_id_fkey',
		}).onDelete('cascade'),
	],
);

export const transactions = pgTable(
	'transactions',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		accountId: uuid('account_id'),
		categoryId: uuid('category_id'),
		goalId: uuid('goal_id'),
		amount: numeric({ precision: 12, scale: 2 }).notNull(),
		type: transactionType().notNull(),
		date: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
		note: text(),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_transactions_account_id').using(
			'btree',
			table.accountId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_transactions_category_id').using(
			'btree',
			table.categoryId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_transactions_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_transactions_date').using(
			'btree',
			table.date.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_transactions_goal_id').using(
			'btree',
			table.goalId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_transactions_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'transactions_user_id_fkey',
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: 'transactions_account_id_fkey',
		}),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'transactions_category_id_fkey',
		}),
		foreignKey({
			columns: [table.goalId],
			foreignColumns: [goals.id],
			name: 'transactions_goal_id_fkey',
		}),
	],
);

export const recurringTransactions = pgTable(
	'recurring_transactions',
	{
		id: uuid()
			.default(sql`uuid_generate_v7()`)
			.primaryKey()
			.notNull(),
		userId: uuid('user_id'),
		accountId: uuid('account_id'),
		categoryId: uuid('category_id'),
		amount: numeric({ precision: 12, scale: 2 }).notNull(),
		type: recurringTransactionType().notNull(),
		recurrenceInterval: interval('recurrence_interval').notNull(),
		nextOccurrence: timestamp('next_occurrence', {
			withTimezone: true,
			mode: 'date',
		}).notNull(),
		note: text(),
		isActive: boolean('is_active').default(true),
		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
		}).defaultNow(),
	},
	(table) => [
		index('idx_recurring_transactions_account_id').using(
			'btree',
			table.accountId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_recurring_transactions_category_id').using(
			'btree',
			table.categoryId.asc().nullsLast().op('uuid_ops'),
		),
		index('idx_recurring_transactions_created_at').using(
			'btree',
			table.createdAt.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_recurring_transactions_next_occurrence').using(
			'btree',
			table.nextOccurrence.asc().nullsLast().op('timestamptz_ops'),
		),
		index('idx_recurring_transactions_user_id').using(
			'btree',
			table.userId.asc().nullsLast().op('uuid_ops'),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: 'recurring_transactions_user_id_fkey',
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: 'recurring_transactions_account_id_fkey',
		}),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'recurring_transactions_category_id_fkey',
		}),
	],
);

export const usersRelations = relations(users, ({ one, many }) => ({
	tier: one(tiers, {
		fields: [users.tierId],
		references: [tiers.id],
	}),
	tokens: many(tokens),
	accounts: many(accounts),
	categories: many(categories),
	budgets: many(budgets),
	goals: many(goals),
	transactions: many(transactions),
	recurringTransactions: many(recurringTransactions),
}));

export const tiersRelations = relations(tiers, ({ many }) => ({
	users: many(users),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
	user: one(users, {
		fields: [tokens.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
	transactions: many(transactions),
	recurringTransactions: many(recurringTransactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	user: one(users, {
		fields: [categories.userId],
		references: [users.id],
	}),
	icon: one(icons, {
		fields: [categories.icon],
		references: [icons.id],
	}),
	budgets: many(budgets),
	transactions: many(transactions),
	recurringTransactions: many(recurringTransactions),
}));

export const iconsRelations = relations(icons, ({ many }) => ({
	categories: many(categories),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
	user: one(users, {
		fields: [budgets.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [budgets.categoryId],
		references: [categories.id],
	}),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
	user: one(users, {
		fields: [goals.userId],
		references: [users.id],
	}),
	transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id],
	}),
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
	}),
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id],
	}),
	goal: one(goals, {
		fields: [transactions.goalId],
		references: [goals.id],
	}),
}));

export const recurringTransactionsRelations = relations(
	recurringTransactions,
	({ one }) => ({
		user: one(users, {
			fields: [recurringTransactions.userId],
			references: [users.id],
		}),
		account: one(accounts, {
			fields: [recurringTransactions.accountId],
			references: [accounts.id],
		}),
		category: one(categories, {
			fields: [recurringTransactions.categoryId],
			references: [categories.id],
		}),
	}),
);

export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}
