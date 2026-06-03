import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class TimetableService {
    private prisma;
    constructor(prisma: PrismaService);
    private addMinutes;
    getTimetable(institutionId: string, classId: string): Promise<({
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
    generateTimetable(institutionId: string, classId: string, periodsPerDay: number, durationMin: number, startTime: string): Promise<any[]>;
    saveTimetable(institutionId: string, classId: string, entries: any[]): Promise<any[]>;
}
