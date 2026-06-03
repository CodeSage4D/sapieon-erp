import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class VisitorService {
    private prisma;
    constructor(prisma: PrismaService);
    getVisitors(institutionId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }[]>;
    createVisitor(institutionId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }>;
    checkOutVisitor(institutionId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        institutionId: string;
        purpose: string;
        hostName: string;
        entryTime: Date;
        exitTime: Date | null;
        passNumber: string;
    }>;
}
