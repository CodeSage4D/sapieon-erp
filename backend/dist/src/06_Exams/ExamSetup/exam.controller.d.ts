import { ExamService } from './exam.service';
export declare class ExamController {
    private examService;
    constructor(examService: ExamService);
    getExams(req: any, subjectId?: string): Promise<({
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
    createExam(req: any, body: any): Promise<{
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
    getExamResults(req: any, id: string): Promise<{
        studentId: string;
        firstName: string;
        lastName: string;
        rollNumber: string;
        marksObtained: number;
        remarks: string | null;
        resultId: string | null;
    }[]>;
    recordResultsBulk(req: any, id: string, body: any): Promise<{
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
