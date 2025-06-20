export class CategoryResponseDto {
	public id: string;
	public name: string;
	public icon: string | null;

	constructor(props: CategoryResponseDto) {
		Object.assign(this, props);
	}
}
