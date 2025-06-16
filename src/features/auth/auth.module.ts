import { Module } from '@nestjs/common';
import { AccessStrategy } from 'src/features/auth/strategies/access.strategy';
import { RefreshStrategy } from 'src/features/auth/strategies/refresh.strategy';
import { AuthController } from './auth.controller';
import { LoginService } from 'src/features/auth/services/login.service';
import { TokensService } from './services/tokens.service';
import { EnvModule } from 'src/env/env.module';
import { DatabaseModule } from 'src/env/database/database.module';
import { ProfileService } from './services/profile.service';
import { LogoutService } from './services/logout.service';
import { RefreshService } from './services/refresh.service';
import { RegisterService } from './services/register.service';

@Module({
	imports: [EnvModule, DatabaseModule],
	providers: [
		AccessStrategy,
		RefreshStrategy,
		LoginService,
		TokensService,
		ProfileService,
		LogoutService,
		RefreshService,
		RegisterService,
	],
	controllers: [AuthController],
})
export class AuthModule {}
