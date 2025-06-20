import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationRequestDto {
	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@Min(1, {
		message: 'Page number must be greater than or equal to 1',
	})
	page: number = 1;

	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@Min(1, {
		message: 'Page size must be greater than or equal to 1',
	})
	size: number = 10;

	@IsString()
	@IsOptional()
	q: string = '';
}
