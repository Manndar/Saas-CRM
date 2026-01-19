import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OrganizationsService } from './organizations.service';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Get('health')
  health() {
    return { message: 'organizations module ready' };
  }

  @Get()
  findAll() {
    return this.organizationsService.findAllOrganizations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOrganizationById(id);
  }

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }
}
