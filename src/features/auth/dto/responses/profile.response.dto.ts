export class ProfileResponseDto {
	id: string;
	email: string;
	name: string;
	type: string;

	constructor(props: ProfileResponseDto) {
		Object.assign(this, props);
	}
}
