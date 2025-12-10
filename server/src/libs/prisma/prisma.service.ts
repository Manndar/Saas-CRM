import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
// Type for Prisma client operations (works for both PrismaService and transaction clients)
export type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends' | '$use'
>;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private shutdownHookRegistered = false;

  constructor() {
    // const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL });

    super({ adapter });
  }
  //   constructor(private readonly configService: ConfigService) { 
  //   // const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
  //   const adapter = new PrismaPg({ url: configService.getOrThrow<string>('DATABASE_URL') });
  //   console.log('Database URL', configService.getOrThrow<string>('DATABASE_URL'));
  //   super({ adapter });
  // }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Connected to the database');
    } catch (err) {
      this.logger.error('Prisma failed to connect', (err as Error).message);
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from the database');
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    if (this.shutdownHookRegistered) return;
    this.shutdownHookRegistered = true;

    // Handle graceful shutdown on termination signals
    const shutdown = async (signal: string) => {
      this.logger.log(`Received ${signal}, closing application...`);
      try {
        await this.$disconnect();
        await app.close();
        this.logger.log('Application closed successfully');
      } catch (error) {
        this.logger.error('Error during shutdown', (error as Error).message);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}
