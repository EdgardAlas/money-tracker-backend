import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { BaseService } from 'src/common/base-service';
import { DatabaseService } from 'src/database/database.provider';
import { categories } from 'src/database/schema';
import { CategoryResponseDto } from 'src/features/categories/dto/responses/category.response.dto';

@Injectable()
export class GetCategoriesService
	implements BaseService<CategoryResponseDto[]>
{
	constructor(
		@Inject(DatabaseService) private readonly databaseService: DatabaseService,
	) {}

	async execute(userId: string) {
		const result = await this.databaseService
			.select()
			.from(categories)
			.where(and(eq(categories.userId, userId), isNull(categories.userId)));

		const categoriesList = result.map(
			(category) =>
				new CategoryResponseDto({
					id: category.id,
					name: category.name,
					icon: category.icon,
				}),
		);

		return categoriesList;
	}
}
