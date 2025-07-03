export class TransactionResponseDto {
	id: string;
	account: string | null;
	category: string | null;
	goal: string | null;
	amount: number;
	type: string;
	date: Date;
	note: string | null;
	title: string;

	constructor(props: TransactionResponseDto) {
		Object.assign(this, props);
	}
}
