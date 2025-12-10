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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    shutdownHookRegistered = false;
    constructor() {
        const adapter = new adapter_pg_1.PrismaPg({ url: process.env.DATABASE_URL });
        super({ adapter });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to the database');
        }
        catch (err) {
            this.logger.error('Prisma failed to connect', err.message);
            throw err;
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from the database');
    }
    async enableShutdownHooks(app) {
        if (this.shutdownHookRegistered)
            return;
        this.shutdownHookRegistered = true;
        const shutdown = async (signal) => {
            this.logger.log(`Received ${signal}, closing application...`);
            try {
                await this.$disconnect();
                await app.close();
                this.logger.log('Application closed successfully');
            }
            catch (error) {
                this.logger.error('Error during shutdown', error.message);
                process.exit(1);
            }
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map