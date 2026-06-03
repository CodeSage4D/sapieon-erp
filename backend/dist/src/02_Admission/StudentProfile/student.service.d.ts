import { PrismaService } from '../../01_Core/prisma/prisma.service';
export declare class StudentService {
    private prisma;
    constructor(prisma: PrismaService);
    private processSensitiveFields;
    private processSensitiveFieldsList;
    findAll(institutionId: string, classId?: string, search?: string, requesterRole?: string, requesterProfileId?: string): Promise<any[]>;
    findOne(institutionId: string, id: string, requesterRole?: string, requesterProfileId?: string): Promise<any>;
    create(institutionId: string, data: any): Promise<any>;
    update(institutionId: string, id: string, data: any): Promise<any>;
    promote(institutionId: string, data: {
        studentIds: string[];
        targetClassId: string;
    }, promotedById?: string): Promise<{
        success: boolean;
        count: number;
    }>;
    getPromotionHistory(institutionId: string): Promise<({
        student: {
            firstName: string;
            lastName: string;
            scholarNumber: string;
        };
        fromClass: {
            name: string;
        };
        toClass: {
            name: string;
        };
        promotedBy: {
            email: string;
        };
    } & {
        id: string;
        academicYear: string;
        studentId: string;
        fromClassId: string;
        toClassId: string;
        promotedById: string;
        promotedAt: Date;
    })[]>;
    remove(institutionId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        state: string | null;
        pinCode: string | null;
        institutionId: string;
        userId: string;
        firstName: string;
        lastName: string;
        status: string;
        aadhaarNumber: string | null;
        gender: string;
        bloodGroup: string | null;
        bankName: string | null;
        bankBranch: string | null;
        accNumber: string | null;
        ifscCode: string | null;
        branchId: string | null;
        classId: string;
        scholarNumber: string;
        rollNumber: string;
        dateOfBirth: Date;
        admissionDate: Date;
        samagraId: string | null;
        familyId: string | null;
        penNumber: string | null;
        birthCertificateNumber: string | null;
        religion: string | null;
        casteCategory: string | null;
        nationality: string;
        motherTongue: string | null;
        fatherName: string | null;
        motherName: string | null;
        fatherOccupation: string | null;
        motherOccupation: string | null;
        annualIncome: number | null;
        houseNo: string | null;
        street: string | null;
        district: string | null;
        accHolderName: string | null;
        upiId: string | null;
        prevSchoolName: string | null;
        tcNumber: string | null;
        migrationCertNo: string | null;
        parentId: string | null;
    }>;
}
