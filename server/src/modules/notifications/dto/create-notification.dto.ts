import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  type!: string;

  @IsOptional()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
