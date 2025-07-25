export class TransactionsResponseDto {
	transactions: {
		id: string;
		account: string | null;
		category: string | null;
		goal: string | null;
		amount: number;
		type: string;
		date: Date;
		note: string | null;
		title: string;
	}[];

	total: number;

	totalIncome: number;
	totalExpense: number;

	constructor(props: TransactionsResponseDto) {
		Object.assign(this, props);
	}
}
