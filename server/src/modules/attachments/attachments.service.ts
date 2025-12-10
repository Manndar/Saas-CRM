import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}
}
