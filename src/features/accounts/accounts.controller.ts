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
	Query,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateAccountRequestDto } from 'src/features/accounts/dto/requests/update-account.request.dto';
import { CreateAccountRequestDto } from './dto/requests/create-account.request.dto';
import { CreateAccountService } from './services/create-account.service';
import { DeleteAccountService } from './services/delete-account.service';
import { GetAccountService } from './services/get-account.service';
import { UpdateAccountService } from './services/update-account.service';
import { LoggedUserEntity } from 'src/features/auth/entities/logged-user.entity';
import { GetAccountsService } from 'src/features/accounts/services/get-accounts.service';
import { PaginationRequestDto } from 'src/common/requests/pagination.request.dto';

@Controller('accounts')
@Auth()
export class AccountsController {
	constructor(
		private readonly getAccountService: GetAccountService,
		private readonly createAccountService: CreateAccountService,
		private readonly updateAccountService: UpdateAccountService,
		private readonly deleteAccountService: DeleteAccountService,
		private readonly getAccountsService: GetAccountsService,
	) {}

	@Get()
	async getAccounts(
		@Query() query: PaginationRequestDto,
		@User('id') userId: string,
	) {
		return this.getAccountsService.execute(query, userId);
	}

	@Get(':id')
	async getAccount(@Param('id') accountId: string, @User('id') userId: string) {
		return this.getAccountService.execute(accountId, userId);
	}

	@Post()
	async createAccount(
		@Body() body: CreateAccountRequestDto,
		@User() user: LoggedUserEntity,
	) {
		return this.createAccountService.execute(body, user);
	}

	@Patch(':id')
	updateAccount(
		@Param('id') accountId: string,
		@Body() body: UpdateAccountRequestDto,
		@User('id') userId: string,
	) {
		return this.updateAccountService.execute(accountId, body, userId);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteAccount(
		@Param('id') accountId: string,
		@User('id') userId: string,
	) {
		return this.deleteAccountService.execute(accountId, userId);
	}
}
