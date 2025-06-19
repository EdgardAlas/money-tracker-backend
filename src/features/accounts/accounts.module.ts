import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AccountsController } from './accounts.controller';
import { CreateAccountService } from './servicesa/create-account.service';
import { DeleteAccountService } from './servicesa/delete-account.service';
import { GetAccountService } from './servicesa/get-account.service';
import { UpdateAccountService } from './servicesa/update-account.service';

@Module({
	imports: [DatabaseModule],
	controllers: [AccountsController],
	providers: [
		CreateAccountService,
		UpdateAccountService,
		DeleteAccountService,
		GetAccountService,
	],
})
export class AccountsModule {}
