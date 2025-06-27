import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionService } from './services/create-transaction.service';
import { DatabaseModule } from 'src/database/database.module';
import { GetTransactionsService } from './services/get-transactions.service';

@Module({
	imports: [DatabaseModule],
	controllers: [TransactionsController],
	providers: [CreateTransactionService, GetTransactionsService],
})
export class TransactionsModule {}
