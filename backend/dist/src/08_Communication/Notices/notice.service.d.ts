import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class NoticeService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotices(institutionId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        content: string;
        targetRoles: string;
        authorName: string;
    }[]>;
    createNotice(institutionId: string, authorName: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        content: string;
        targetRoles: string;
        authorName: string;
    }>;
}
