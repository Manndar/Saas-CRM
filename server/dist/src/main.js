"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    const reflector = app.get(core_1.Reflector);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector), new response_interceptor_1.ResponseInterceptor());
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 5000);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map