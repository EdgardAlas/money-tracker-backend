import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { UpdateAccountRequestDto } from 'src/features/accounts/dto/requests/update-account.request.dto';
import { CreateAccountRequestDto } from './dto/requests/create-account.request.dto';
import { CreateAccountService } from './servicesa/create-account.service';
import { DeleteAccountService } from './servicesa/delete-account.service';
import { GetAccountService } from './servicesa/get-account.service';
import { UpdateAccountService } from './servicesa/update-account.service';

@Controller('accounts')
@Auth()
export class AccountsController {
	constructor(
		private readonly getAccountService: GetAccountService,
		private readonly createAccountService: CreateAccountService,
		private readonly updateAccountService: UpdateAccountService,
		private readonly deleteAccountService: DeleteAccountService,
	) {}

	@Get(':id')
	async getAccount(
		@Param('id') accountId: string,
		@GetUser('id') userId: string,
	) {
		return this.getAccountService.execute(accountId, userId);
	}

	@Post()
	async createAccount(
		@Body() body: CreateAccountRequestDto,
		@GetUser('id') userId: string,
	) {
		return this.createAccountService.execute(body, userId);
	}

	@Patch(':id')
	updateAccount(
		@Param('id') accountId: string,
		@Body() body: UpdateAccountRequestDto,
		@GetUser('id') userId: string,
	) {
		return this.updateAccountService.execute(accountId, body, userId);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAccount(
		@Param('id') accountId: string,
		@GetUser('id') userId: string,
	) {
		return this.deleteAccountService.execute(accountId, userId);
	}
}
