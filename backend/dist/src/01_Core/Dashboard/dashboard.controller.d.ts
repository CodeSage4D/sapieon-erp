import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
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
