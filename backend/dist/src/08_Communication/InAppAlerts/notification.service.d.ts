import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        content: string;
        isRead: boolean;
        userId: string;
    }[]>;
    markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
