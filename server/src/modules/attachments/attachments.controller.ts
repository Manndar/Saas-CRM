import { Controller, Get } from '@nestjs/common';

import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get('health')
  health() {
    return { message: 'attachments module ready' };
  }
}
