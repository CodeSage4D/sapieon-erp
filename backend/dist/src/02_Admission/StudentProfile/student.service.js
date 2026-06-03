"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
const encryption_helper_1 = require("../../common/helpers/encryption.helper");
let StudentService = class StudentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    processSensitiveFields(student, requesterRole) {
        if (!student)
            return student;
        const decryptedAadhaar = (0, encryption_helper_1.decrypt)(student.aadhaarNumber);
        const decryptedAccNumber = (0, encryption_helper_1.decrypt)(student.accNumber);
        const decryptedIfscCode = (0, encryption_helper_1.decrypt)(student.ifscCode);
        const isAuthorized = requesterRole === 'SUPER_ADMIN' || requesterRole === 'INSTITUTE_ADMIN';
        return {
            ...student,
            aadhaarNumber: isAuthorized ? decryptedAadhaar : (0, encryption_helper_1.maskSensitiveData)(decryptedAadhaar, 4),
            accNumber: isAuthorized ? decryptedAccNumber : (0, encryption_helper_1.maskSensitiveData)(decryptedAccNumber, 4),
            ifscCode: isAuthorized ? decryptedIfscCode : (0, encryption_helper_1.maskSensitiveData)(decryptedIfscCode, 4),
        };
    }
    processSensitiveFieldsList(students, requesterRole) {
        return students.map(s => this.processSensitiveFields(s, requesterRole));
    }
    async findAll(institutionId, classId, search, requesterRole, requesterProfileId) {
        const where = { institutionId };
        if (classId) {
            where.classId = classId;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { rollNumber: { contains: search, mode: 'insensitive' } },
                { scholarNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (requesterRole === 'TEACHER' && requesterProfileId) {
            where.class = {
                OR: [
                    { classTeacherId: requesterProfileId },
                    { subjects: { some: { teacherId: requesterProfileId } } }
                ]
            };
        }
        const students = await this.prisma.student.findMany({
            where,
            include: {
                class: { select: { id: true, name: true, board: true, stream: true } },
                parent: { select: { id: true, firstName: true, lastName: true, phone: true } },
            },
            orderBy: { rollNumber: 'asc' },
        });
        return this.processSensitiveFieldsList(students, requesterRole);
    }
    async findOne(institutionId, id, requesterRole, requesterProfileId) {
        const student = await this.prisma.student.findFirst({
            where: { id, institutionId },
            include: {
                user: { select: { email: true, isActive: true } },
                class: { select: { id: true, name: true, board: true, stream: true } },
                parent: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        occupation: true,
                        address: true,
                        user: { select: { email: true } },
                    },
                },
                documents: true,
                timeline: { orderBy: { eventDate: 'desc' } },
                feeAllocations: {
                    include: { feeStructure: true },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        if (requesterRole === 'TEACHER' && requesterProfileId) {
            const isAssigned = await this.prisma.class.findFirst({
                where: {
                    id: student.classId,
                    OR: [
                        { classTeacherId: requesterProfileId },
                        { subjects: { some: { teacherId: requesterProfileId } } }
                    ]
                }
            });
            if (!isAssigned) {
                throw new common_1.ForbiddenException('You can only access students in your assigned classes');
            }
        }
        return this.processSensitiveFields(student, requesterRole);
    }
    async create(institutionId, data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Login Email already registered');
        }
        if (data.aadhaarNumber && !/^\d{12}$/.test(data.aadhaarNumber)) {
            throw new common_1.BadRequestException('Aadhaar number must be exactly 12 numeric digits');
        }
        if (data.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode.toUpperCase())) {
            throw new common_1.BadRequestException('Invalid bank IFSC code format (e.g. SBIN0004520)');
        }
        if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) {
            throw new common_1.BadRequestException('PIN code must be exactly 6 digits');
        }
        const createdStudent = await this.prisma.$transaction(async (tx) => {
            const studentCount = await tx.student.count({ where: { institutionId } });
            const currentYear = new Date().getFullYear();
            const scholarNumber = `SCH-${currentYear}-${String(studentCount + 1).padStart(4, '0')}`;
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash: data.passwordHash || '$2a$10$tMh4r7K/9V87Vb6L.vF2e.0.eP4fM3z7rWq1c7tE/s2F6C1l3j9l2',
                    role: 'STUDENT',
                    institutionId,
                },
            });
            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    scholarNumber,
                    rollNumber: data.rollNumber,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dateOfBirth: new Date(data.dateOfBirth),
                    gender: data.gender,
                    classId: data.classId,
                    parentId: data.parentId || null,
                    institutionId,
                    aadhaarNumber: (0, encryption_helper_1.encrypt)(data.aadhaarNumber) || null,
                    samagraId: data.samagraId || null,
                    familyId: data.familyId || null,
                    penNumber: data.penNumber || null,
                    birthCertificateNumber: data.birthCertificateNumber || null,
                    bloodGroup: data.bloodGroup || null,
                    religion: data.religion || null,
                    casteCategory: data.casteCategory || 'GENERAL',
                    nationality: data.nationality || 'Indian',
                    motherTongue: data.motherTongue || null,
                    fatherName: data.fatherName || null,
                    motherName: data.motherName || null,
                    fatherOccupation: data.fatherOccupation || null,
                    motherOccupation: data.motherOccupation || null,
                    annualIncome: data.annualIncome ? parseFloat(data.annualIncome) : null,
                    bankName: data.bankName || null,
                    accHolderName: data.accHolderName || null,
                    accNumber: (0, encryption_helper_1.encrypt)(data.accNumber) || null,
                    ifscCode: data.ifscCode ? (0, encryption_helper_1.encrypt)(data.ifscCode.toUpperCase()) : null,
                    bankBranch: data.bankBranch || null,
                    upiId: data.upiId || null,
                    houseNo: data.houseNo || null,
                    street: data.street || null,
                    city: data.city || null,
                    district: data.district || null,
                    state: data.state || null,
                    pinCode: data.pinCode || null,
                    prevSchoolName: data.prevSchoolName || null,
                    tcNumber: data.tcNumber || null,
                    migrationCertNo: data.migrationCertNo || null,
                },
            });
            await tx.timelineEvent.create({
                data: {
                    studentId: student.id,
                    type: 'ADMISSION',
                    description: `Student admitted under permanent Scholar No. ${scholarNumber}.`,
                },
            });
            return student;
        });
        return this.processSensitiveFields(createdStudent, 'SUPER_ADMIN');
    }
    async update(institutionId, id, data) {
        const student = await this.prisma.student.findFirst({
            where: { id, institutionId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (data.aadhaarNumber && !/^\d{12}$/.test(data.aadhaarNumber)) {
            throw new common_1.BadRequestException('Aadhaar number must be exactly 12 numeric digits');
        }
        if (data.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode.toUpperCase())) {
            throw new common_1.BadRequestException('Invalid bank IFSC code format');
        }
        const updatedStudent = await this.prisma.student.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                classId: data.classId,
                rollNumber: data.rollNumber,
                aadhaarNumber: data.aadhaarNumber !== undefined ? ((0, encryption_helper_1.encrypt)(data.aadhaarNumber) || null) : undefined,
                samagraId: data.samagraId,
                familyId: data.familyId,
                penNumber: data.penNumber,
                birthCertificateNumber: data.birthCertificateNumber,
                casteCategory: data.casteCategory,
                religion: data.religion,
                bloodGroup: data.bloodGroup,
                fatherName: data.fatherName,
                motherName: data.motherName,
                annualIncome: data.annualIncome ? parseFloat(data.annualIncome) : undefined,
                bankName: data.bankName,
                accHolderName: data.accHolderName,
                accNumber: data.accNumber !== undefined ? ((0, encryption_helper_1.encrypt)(data.accNumber) || null) : undefined,
                ifscCode: data.ifscCode !== undefined ? (data.ifscCode ? (0, encryption_helper_1.encrypt)(data.ifscCode.toUpperCase()) : null) : undefined,
                bankBranch: data.bankBranch,
                houseNo: data.houseNo,
                street: data.street,
                city: data.city,
                district: data.district,
                state: data.state,
                pinCode: data.pinCode,
            },
        });
        return this.processSensitiveFields(updatedStudent, 'SUPER_ADMIN');
    }
    async promote(institutionId, data, promotedById) {
        return this.prisma.$transaction(async (tx) => {
            const targetClass = await tx.class.findUnique({
                where: { id: data.targetClassId },
            });
            if (!targetClass || targetClass.institutionId !== institutionId) {
                throw new common_1.BadRequestException('Target class not found');
            }
            let activePromotedById = promotedById;
            if (!activePromotedById) {
                const fallbackAdmin = await tx.user.findFirst({
                    where: { role: 'INSTITUTE_ADMIN', institutionId },
                });
                activePromotedById = fallbackAdmin ? fallbackAdmin.id : undefined;
            }
            if (!activePromotedById) {
                throw new common_1.BadRequestException('Authorized Admin User ID is required for promotion ledger archiving.');
            }
            const results = [];
            for (const studentId of data.studentIds) {
                const student = await tx.student.findFirst({
                    where: { id: studentId, institutionId },
                });
                if (!student)
                    continue;
                const classStudents = await tx.student.count({
                    where: { classId: data.targetClassId },
                });
                const classDigits = targetClass.name.replace(/\D/g, '') || '0';
                const nextRoll = `${classDigits}1${String(classStudents + 1).padStart(2, '0')}`;
                await tx.promotionHistory.create({
                    data: {
                        studentId,
                        fromClassId: student.classId,
                        toClassId: data.targetClassId,
                        academicYear: '2026-2027',
                        promotedById: activePromotedById,
                    },
                });
                const updated = await tx.student.update({
                    where: { id: studentId },
                    data: {
                        classId: data.targetClassId,
                        rollNumber: nextRoll,
                    },
                });
                await tx.timelineEvent.create({
                    data: {
                        studentId,
                        type: 'PROMOTION',
                        description: `Promoted automatically to ${targetClass.name} under Roll No. ${nextRoll}.`,
                    },
                });
                results.push(updated);
            }
            return { success: true, count: results.length };
        });
    }
    async getPromotionHistory(institutionId) {
        return this.prisma.promotionHistory.findMany({
            where: {
                student: { institutionId },
            },
            include: {
                student: { select: { firstName: true, lastName: true, scholarNumber: true } },
                fromClass: { select: { name: true } },
                toClass: { select: { name: true } },
                promotedBy: { select: { email: true } },
            },
            orderBy: { promotedAt: 'desc' },
        });
    }
    async remove(institutionId, id) {
        const student = await this.prisma.student.findFirst({
            where: { id, institutionId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.timelineEvent.deleteMany({ where: { studentId: id } });
            await tx.document.deleteMany({ where: { studentId: id } });
            await tx.attendance.deleteMany({ where: { studentId: id } });
            await tx.studentFeeAllocation.deleteMany({ where: { studentId: id } });
            await tx.examResult.deleteMany({ where: { studentId: id } });
            const stud = await tx.student.delete({ where: { id } });
            await tx.user.delete({ where: { id: student.userId } });
            return stud;
        });
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentService);
//# sourceMappingURL=student.service.js.map