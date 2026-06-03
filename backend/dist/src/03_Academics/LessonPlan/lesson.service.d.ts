import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class LessonService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlans(institutionId: string, teacherId?: string, subjectId?: string): Promise<({
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
        subject: {
            id: string;
            name: string;
            code: string;
            class: {
                id: string;
                name: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        status: string;
        teacherId: string;
        subjectId: string;
        syllabusPercent: number;
    })[]>;
    createPlan(institutionId: string, teacherUserId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        status: string;
        teacherId: string;
        subjectId: string;
        syllabusPercent: number;
    }>;
    updatePlan(institutionId: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        status: string;
        teacherId: string;
        subjectId: string;
        syllabusPercent: number;
    }>;
    deletePlan(institutionId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        status: string;
        teacherId: string;
        subjectId: string;
        syllabusPercent: number;
    }>;
}
