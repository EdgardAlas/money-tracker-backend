export class PaginationResponseDto<T> {
	items: T[];
	pageSize: number;
	currentPage: number;
	totalCount?: number;
	totalPages?: number;

	constructor(props: PaginationResponseDto<T>) {
		Object.assign(this, props);
	}
}
