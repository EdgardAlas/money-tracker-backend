import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AccountsController } from './accounts.controller';
import { CreateAccountService } from './services/create-account.service';
import { DeleteAccountService } from './services/delete-account.service';
import { GetAccountService } from './services/get-account.service';
import { UpdateAccountService } from './services/update-account.service';
import { GetAccountsService } from './services/get-accounts.service';
import { TransactionsModule } from 'src/features/transactions/transactions.module';

@Module({
	imports: [DatabaseModule, TransactionsModule],
	controllers: [AccountsController],
	providers: [
		CreateAccountService,
		UpdateAccountService,
		DeleteAccountService,
		GetAccountService,
		GetAccountsService,
	],
})
export class AccountsModule {}
