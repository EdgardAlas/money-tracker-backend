import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesController } from './categories.controller';
import { GetCategoriesService } from './services/get-categories.service';

@Module({
	imports: [DatabaseModule],
	controllers: [CategoriesController],
	providers: [GetCategoriesService],
})
export class CategoriesModule {}
