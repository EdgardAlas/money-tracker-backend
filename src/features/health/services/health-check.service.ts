import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base-service';
import { HealthCheckResponseDto } from 'src/features/health/dto/responses/health-check.response.dto';

@Injectable()
export class HealthCheckService implements BaseService<HealthCheckResponseDto> {
	execute() {
		return new HealthCheckResponseDto();
	}
}
