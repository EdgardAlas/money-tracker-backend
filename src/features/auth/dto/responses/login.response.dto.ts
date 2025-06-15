export class LoginResponseDto {
	accessToken: string;

	refreshToken: string;

	constructor(props: LoginResponseDto) {
		Object.assign(this, props);
	}
}
