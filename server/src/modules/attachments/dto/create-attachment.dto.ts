import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  mimetype!: string;

  @IsOptional()
  @IsString()
  ticketId?: string;
}
