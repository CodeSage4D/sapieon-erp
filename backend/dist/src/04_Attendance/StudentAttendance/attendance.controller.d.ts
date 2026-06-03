import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    getClassAttendance(req: any, classId: string, date: string): Promise<{
        studentId: string;
        firstName: string;
        lastName: string;
        rollNumber: string;
        status: string;
        remarks: string | null;
        attendanceId: string | null;
    }[]>;
    recordBulk(req: any, body: any): Promise<{
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
    getOverview(req: any): Promise<{
        totalStudents: number;
        attendanceRate: number;
    }>;
}
