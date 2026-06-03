import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    getClassAttendance(institutionId: string, classId: string, dateStr: string): Promise<{
        studentId: string;
        firstName: string;
        lastName: string;
        rollNumber: string;
        status: string;
        remarks: string | null;
        attendanceId: string | null;
    }[]>;
    recordBulk(institutionId: string, staffUserId: string, data: any): Promise<{
        success: boolean;
        count: any;
    }>;
    getStudentSummary(studentId: string): Promise<{
        total: number;
        present: number;
        absent: number;
        rate: number;
        history: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            studentId: string;
            date: Date;
            remarks: string | null;
            recordedById: string;
        }[];
    }>;
    getInstitutionOverview(institutionId: string): Promise<{
        totalStudents: number;
        attendanceRate: number;
    }>;
}
