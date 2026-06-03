import { ClassService } from './class.service';
export declare class ClassController {
    private classService;
    constructor(classService: ClassService);
    getClasses(req: any): Promise<({
        classTeacher: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        branchId: string | null;
        section: string | null;
        stream: string;
        board: string;
        classTeacherId: string | null;
    })[]>;
    getSubjects(req: any, classId?: string): Promise<({
        class: {
            id: string;
            name: string;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        classId: string;
        teacherId: string | null;
    })[]>;
}
