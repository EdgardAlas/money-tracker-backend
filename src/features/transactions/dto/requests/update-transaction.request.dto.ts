import { PartialType } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from 'src/features/transactions/dto/requests/create-transaction.request.dto';

export class UpdateTransactionRequestDto extends PartialType(
	CreateTransactionRequestDto,
) {}
