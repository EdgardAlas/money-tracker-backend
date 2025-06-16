import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefreshGuard } from 'src/features/auth/guards/refresh.guard';

export const Refresh = () => applyDecorators(UseGuards(RefreshGuard));
