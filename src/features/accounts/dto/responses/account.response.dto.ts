export class AccountResponseDto {
	id: string;
	name: string;
	type: string;

	constructor(props: AccountResponseDto) {
		Object.assign(this, props);
	}
}
