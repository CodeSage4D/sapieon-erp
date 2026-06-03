import { PrismaService } from '../prisma/prisma.service';
export declare class BranchService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(institutionId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pinCode: string | null;
        phone: string | null;
        institutionId: string;
    }[]>;
    create(institutionId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pinCode: string | null;
        phone: string | null;
        institutionId: string;
    }>;
}
