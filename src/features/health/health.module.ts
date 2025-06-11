import { Module } from '@nestjs/common';
import { HealthCheckService } from './services/health-check.service';
import { HealthController } from './health.controller';

@Module({
	providers: [HealthCheckService],
	controllers: [HealthController],
})
export class HealthModule {}
