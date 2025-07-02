export class AccountResponseDto {
	id: string;
	name: string;
	type: string;
	balance: number;
	income: number;
	expense: number;

	constructor(props: AccountResponseDto) {
		Object.assign(this, props);
	}
}
