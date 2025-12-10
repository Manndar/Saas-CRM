import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}
}
