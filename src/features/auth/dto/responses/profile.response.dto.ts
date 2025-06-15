export class ProfileResponseDto {
	id: string;
	email: string;
	firstName: string;
	lastName: string;

	constructor(props: ProfileResponseDto) {
		Object.assign(this, props);
	}
}
