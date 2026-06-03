import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private readonly prisma;
    constructor(prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private getModelNameFromUrl;
    private getFriendlyActionName;
    private sanitize;
}
