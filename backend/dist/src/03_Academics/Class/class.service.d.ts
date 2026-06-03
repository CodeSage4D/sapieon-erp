import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class ClassService {
    private prisma;
    constructor(prisma: PrismaService);
    getClasses(institutionId: string): Promise<({
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
    getSubjects(institutionId: string, classId?: string): Promise<({
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
