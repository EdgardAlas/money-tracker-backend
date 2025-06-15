import { Module } from '@nestjs/common';
import { AccessStrategy } from 'src/features/auth/strategies/access.strategy';
import { RefreshStrategy } from 'src/features/auth/strategies/refresh.strategy';
import { AuthController } from './auth.controller';
import { LoginService } from 'src/features/auth/services/login.service';

@Module({
	providers: [AccessStrategy, RefreshStrategy, LoginService],
	controllers: [AuthController],
})
export class AuthModule {}
