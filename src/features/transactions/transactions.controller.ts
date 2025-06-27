import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateTransactionRequestDto } from 'src/features/transactions/dto/requests/create-transaction.request.dto';
import { CreateTransactionService } from 'src/features/transactions/services/create-transaction.service';

@Controller('transactions')
@Auth()
export class TransactionsController {
	constructor(
		private readonly createTransactionService: CreateTransactionService,
	) {}

	@Post()
	async createTransaction(
		@Body() body: CreateTransactionRequestDto,
		@User('id') userId: string,
	) {
		return this.createTransactionService.execute(body, userId);
	}
}
