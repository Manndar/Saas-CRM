"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../prisma");
const app_error_1 = require("../../common/errors/app-error");
let OrganizationsService = class OrganizationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllOrganizations() {
        try {
            return await this.prisma.organization.findMany();
        }
        catch (error) {
            throw new app_error_1.AppError('Failed to find all organizations', 500);
        }
    }
    async findOrganizationById(id) {
        try {
            const organization = await this.prisma.organization.findUnique({ where: { id } });
            if (!organization) {
                throw new app_error_1.AppError('Organization not found', 404);
            }
            return organization;
        }
        catch (error) {
            throw new app_error_1.AppError('Failed to find organization by id', 404);
        }
    }
    async createOrganization(createOrganizationDto) {
        try {
            return await this.prisma.organization.create({ data: createOrganizationDto });
        }
        catch (error) {
            throw new app_error_1.AppError('Failed to create organization', 400);
        }
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map