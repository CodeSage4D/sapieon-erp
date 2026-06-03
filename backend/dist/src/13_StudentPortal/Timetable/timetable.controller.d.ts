import { TimetableService } from './timetable.service';
import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class TimetableController {
    private timetableService;
    private prisma;
    constructor(timetableService: TimetableService, prisma: PrismaService);
    private validateClassInchargeOrAdmin;
    getTimetable(req: any, classId: string): Promise<({
        teacher: {
            id: string;
            employeeId: string;
            firstName: string;
            lastName: string;
        };
        subject: {
            id: string;
            name: string;
            code: string;
            teacherId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        classId: string;
        teacherId: string;
        subjectId: string;
        dayOfWeek: string;
        periodNumber: number;
        startTime: string;
        endTime: string;
    })[]>;
    generateTimetable(req: any, classId: string, body: {
        periodsPerDay: number;
        durationMin: number;
        startTime: string;
    }): Promise<any[]>;
    saveTimetable(req: any, classId: string, body: {
        entries: any[];
    }): Promise<any[]>;
}
