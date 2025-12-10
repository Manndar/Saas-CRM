import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}
}
