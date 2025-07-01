import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionService } from './services/create-transaction.service';
import { DatabaseModule } from 'src/database/database.module';
import { GetTransactionsService } from './services/get-transactions.service';
import { TransactionsHelpersService } from './services/transactions-helpers.service';
import { UpdateTransactionService } from './services/update-transaction.service';

@Module({
	imports: [DatabaseModule],
	controllers: [TransactionsController],
	providers: [CreateTransactionService, GetTransactionsService, TransactionsHelpersService, UpdateTransactionService],
})
export class TransactionsModule {}
