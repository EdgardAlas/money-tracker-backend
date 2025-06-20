import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GetCategoriesService } from 'src/features/categories/services/get-categories.service';

@Controller('categories')
@Auth()
export class CategoriesController {
	constructor(private readonly getCategoriesService: GetCategoriesService) {}

	@Get()
	async getCategories(@User('id') userId: string) {
		return this.getCategoriesService.execute(userId);
	}
}
