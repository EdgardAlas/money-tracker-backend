import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTransactionRequestDto } from 'src/features/transactions/dto/requests/create-transaction.request.dto';
import { GetTransactionsRequestDto } from 'src/features/transactions/dto/requests/get-transactions.request.dto';
import { CreateTransactionService } from 'src/features/transactions/services/create-transaction.service';
import { GetTransactionsService } from 'src/features/transactions/services/get-transactions.service';

@Controller('transactions')
@Auth()
export class TransactionsController {
	constructor(
		private readonly createTransactionService: CreateTransactionService,
		private readonly getTransactionsService: GetTransactionsService,
	) {}

	@Get()
	async getTransactions(
		@User('id') userId: string,
		@Query() query: GetTransactionsRequestDto,
	) {
		return this.getTransactionsService.getTransactions(query, userId);
	}

	@Post()
	async createTransaction(
		@Body() body: CreateTransactionRequestDto,
		@User('id') userId: string,
	) {
		return this.createTransactionService.execute(body, userId);
	}
}
