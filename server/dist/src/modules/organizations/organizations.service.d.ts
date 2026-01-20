import { PrismaService } from '../../prisma';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';
export declare class OrganizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllOrganizations(): Promise<Organization[]>;
    findOrganizationById(id: string): Promise<Organization | null>;
    createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization>;
}
