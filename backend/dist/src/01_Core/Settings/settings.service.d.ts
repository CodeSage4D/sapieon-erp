import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(institutionId: string): Promise<{
        id: string;
        updatedAt: Date;
        institutionId: string;
        academicYear: string;
        gradingSystem: string;
        timezone: string;
        currency: string;
    }>;
    update(institutionId: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        institutionId: string;
        academicYear: string;
        gradingSystem: string;
        timezone: string;
        currency: string;
    }>;
}
