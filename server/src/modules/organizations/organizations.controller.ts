import { Controller, Get } from '@nestjs/common';

import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('health')
  health() {
    return { message: 'organizations module ready' };
  }
}
