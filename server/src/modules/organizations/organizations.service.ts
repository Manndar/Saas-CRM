import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma';
import { Organization } from '@prisma/client';
import { AppError } from '../../common/errors/app-error';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAllOrganizations(): Promise<Organization[]> {
    try {
      return await this.prisma.organization.findMany();
    } catch (error) {
      throw new AppError('Failed to find all organizations', 500);
    }
  }

  async findOrganizationById(id: string): Promise<Organization | null> {
    try {
      const organization = await this.prisma.organization.findUnique({ where: { id } });
      if (!organization) {
        throw new AppError('Organization not found', 404);
      }
      return organization;
    } catch (error) {
      throw new AppError('Failed to find organization by id', 404);
    }
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    try {
      return await this.prisma.organization.create({ data: createOrganizationDto });
    } catch (error) {
      throw new AppError('Failed to create organization', 400);
    }
  }
}
