import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from 'src/features/health/services/health-check.service';

@Controller('health')
export class HealthController {
	constructor(private readonly healthCheckService: HealthCheckService) {}

	@Get()
	healthCheck() {
		return this.healthCheckService.execute();
	}
}
