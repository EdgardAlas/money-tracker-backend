import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GetGoalsService } from './services/get-goals.service';
import { DatabaseModule } from 'src/database/database.module';
import { CreateGoalsService } from './services/create-goals.service';

@Module({
	imports: [DatabaseModule],
	controllers: [GoalsController],
	providers: [GetGoalsService, CreateGoalsService],
})
export class GoalsModule {}
