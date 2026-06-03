import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class ExamService {
    private prisma;
    constructor(prisma: PrismaService);
    getExams(institutionId: string, subjectId?: string): Promise<({
        subject: {
            name: string;
            code: string;
            class: {
                id: string;
                name: string;
            };
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        examType: string;
        maxMarks: number;
        practicalMarks: number;
        internalMarks: number;
        examDate: Date;
        subjectId: string;
    })[]>;
    createExam(institutionId: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        examType: string;
        maxMarks: number;
        practicalMarks: number;
        internalMarks: number;
        examDate: Date;
        subjectId: string;
    }>;
    getExamResults(institutionId: string, examId: string): Promise<{
        studentId: string;
        firstName: string;
        lastName: string;
        rollNumber: string;
        marksObtained: number;
        remarks: string | null;
        resultId: string | null;
    }[]>;
    recordResultsBulk(institutionId: string, examId: string, data: {
        results: any[];
    }): Promise<{
        success: boolean;
        count: number;
    }>;
    getStudentReport(studentId: string): Promise<{
        examId: string;
        examName: string;
        subjectName: string;
        marksObtained: number;
        maxMarks: number;
        percentage: number;
        grade: string;
        remarks: string | null;
    }[]>;
}
