import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTransactionRequestDto } from 'src/features/transactions/dto/requests/create-transaction.request.dto';
import { GetTransactionsRequestDto } from 'src/features/transactions/dto/requests/get-transactions.request.dto';
import { CreateTransactionService } from 'src/features/transactions/services/create-transaction.service';
import { GetTransactionsService } from 'src/features/transactions/services/get-transactions.service';
import { UpdateTransactionService } from 'src/features/transactions/services/update-transaction.service';

@Controller('transactions')
@Auth()
export class TransactionsController {
	constructor(
		private readonly createTransactionService: CreateTransactionService,
		private readonly updateTransactionService: UpdateTransactionService,
		private readonly getTransactionsService: GetTransactionsService,
	) {}

	@Get()
	async getTransactions(
		@User('id') userId: string,
		@Query() query: GetTransactionsRequestDto,
	) {
		return this.getTransactionsService.execute(query, userId);
	}

	@Post()
	async createTransaction(
		@Body() body: CreateTransactionRequestDto,
		@User('id') userId: string,
	) {
		return this.createTransactionService.execute(body, userId);
	}

	@Patch(':transactionId')
	async updateTransaction(
		@User('id') userId: string,
		@Body() body: CreateTransactionRequestDto,
		@Param('transactionId') transactionId: string,
	) {
		return this.updateTransactionService.execute(transactionId, body, userId);
	}
}
