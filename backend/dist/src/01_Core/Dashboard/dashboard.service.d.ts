import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminStats(institutionId: string): Promise<{
        studentCount: number;
        staffCount: number;
        classCount: number;
        feeOverview: {
            totalDue: number;
            totalPaid: number;
            totalPending: number;
            collectionRate: number;
        };
        attendanceRate: number;
        recentNotices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            institutionId: string;
            title: string;
            content: string;
            targetRoles: string;
            authorName: string;
        }[];
        classes: {
            id: string;
            name: string;
            studentCount: number;
        }[];
        weakStudents: any[];
    }>;
}
