export class HealthCheckResponseDto {
	public message?: string;

	constructor(message: string = 'The API is up and running!') {
		this.message = message;
	}
}
