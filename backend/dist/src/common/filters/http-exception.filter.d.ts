import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private prisma;
    constructor(prisma: PrismaService);
    catch(exception: unknown, host: ArgumentsHost): Promise<void>;
}
