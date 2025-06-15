export class RefreshTokenEntity {
	constructor(
		public id: string,
		public userId: string,
		public jti: string,
		public expirationDate: Date,
	) {}
}
