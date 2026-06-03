import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private studentService;
    constructor(studentService: StudentService);
    findAll(req: any, classId?: string, search?: string): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    create(req: any, body: CreateStudentDto): Promise<any>;
    update(req: any, id: string, body: UpdateStudentDto): Promise<any>;
    promote(req: any, body: {
        studentIds: string[];
        targetClassId: string;
    }): Promise<{
        success: boolean;
        count: number;
    }>;
    getPromotionHistory(req: any): Promise<({
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
    remove(req: any, id: string): Promise<{
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
