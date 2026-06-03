"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const prisma_service_1 = require("./01_Core/prisma/prisma.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const encryptionKey = process.env.BACKEND_ENCRYPTION_KEY;
    if (!encryptionKey) {
        console.error('CRITICAL ERROR: BACKEND_ENCRYPTION_KEY is not defined in the environment variables!');
        process.exit(1);
    }
    const keyLength = Buffer.from(encryptionKey, 'utf8').length;
    if (keyLength !== 32) {
        console.error(`CRITICAL ERROR: BACKEND_ENCRYPTION_KEY must be exactly 32 bytes (256-bit). Provided length: ${keyLength} bytes.`);
        process.exit(1);
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const prisma = app.get(prisma_service_1.PrismaService);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(prisma));
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Backend server successfully listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map