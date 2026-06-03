import { LessonService } from './lesson.service';
export declare class LessonController {
    private lessonService;
    constructor(lessonService: LessonService);
    getPlans(req: any, teacherId?: string, subjectId?: string): Promise<({
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
    createPlan(req: any, body: any): Promise<{
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
    updatePlan(req: any, id: string, body: any): Promise<{
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
    deletePlan(req: any, id: string): Promise<{
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
