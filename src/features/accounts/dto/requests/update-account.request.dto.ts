import { PartialType } from '@nestjs/swagger';
import { CreateAccountRequestDto } from 'src/features/accounts/dto/requests/create-account.request.dto';

export class UpdateAccountRequestDto extends PartialType(
	CreateAccountRequestDto,
) {}
