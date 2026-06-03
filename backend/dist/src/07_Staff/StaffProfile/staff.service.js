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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let StaffService = class StaffService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStaff(institutionId, designation) {
        const where = { institutionId };
        if (designation) {
            where.designation = designation;
        }
        return this.prisma.staff.findMany({
            where,
            include: {
                user: { select: { email: true, isActive: true } },
            },
            orderBy: { employeeId: 'asc' },
        });
    }
    async createStaff(institutionId, data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash: data.passwordHash || '$2a$10$tMh4r7K/9V87Vb6L.vF2e.0.eP4fM3z7rWq1c7tE/s2F6C1l3j9l2',
                    role: data.role || 'TEACHER',
                    institutionId,
                },
            });
            return tx.staff.create({
                data: {
                    userId: user.id,
                    employeeId: data.employeeId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    designation: data.designation,
                    joiningDate: new Date(data.joiningDate || Date.now()),
                    salary: parseFloat(data.salary || 0),
                    institutionId,
                    aadhaarNumber: data.aadhaarNumber || null,
                    panNumber: data.panNumber || null,
                    qualification: data.qualification || null,
                    experience: data.experience !== undefined ? parseInt(data.experience) : null,
                    gender: data.gender || null,
                    bloodGroup: data.bloodGroup || null,
                    fatherSpouseName: data.fatherSpouseName || null,
                    permanentAddress: data.permanentAddress || null,
                    bankName: data.bankName || null,
                    bankBranch: data.bankBranch || null,
                    accNumber: data.accNumber || null,
                    ifscCode: data.ifscCode || null,
                    pfNumber: data.pfNumber || null,
                    esiNumber: data.esiNumber || null,
                    emergencyContactName: data.emergencyContactName || null,
                    emergencyContactPhone: data.emergencyContactPhone || null,
                    degrees: data.degrees || [],
                    skills: data.skills || [],
                    certifications: data.certifications || [],
                    subjectsExpertise: data.subjectsExpertise || [],
                },
            });
        });
    }
    async getStaffById(institutionId, id) {
        const staff = await this.prisma.staff.findFirst({
            where: { id, institutionId },
            include: {
                user: { select: { email: true, role: true, isActive: true } },
                payrolls: true,
                leaves: true,
            },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return staff;
    }
    async updateStaff(institutionId, id, data) {
        const staff = await this.prisma.staff.findFirst({
            where: { id, institutionId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return this.prisma.staff.update({
            where: { id },
            data: {
                firstName: data.firstName !== undefined ? data.firstName : staff.firstName,
                lastName: data.lastName !== undefined ? data.lastName : staff.lastName,
                phone: data.phone !== undefined ? data.phone : staff.phone,
                designation: data.designation !== undefined ? data.designation : staff.designation,
                joiningDate: data.joiningDate !== undefined ? new Date(data.joiningDate) : staff.joiningDate,
                salary: data.salary !== undefined ? parseFloat(data.salary) : staff.salary,
                status: data.status !== undefined ? data.status : staff.status,
                aadhaarNumber: data.aadhaarNumber !== undefined ? data.aadhaarNumber : staff.aadhaarNumber,
                panNumber: data.panNumber !== undefined ? data.panNumber : staff.panNumber,
                qualification: data.qualification !== undefined ? data.qualification : staff.qualification,
                experience: data.experience !== undefined ? (data.experience ? parseInt(data.experience) : null) : staff.experience,
                gender: data.gender !== undefined ? data.gender : staff.gender,
                bloodGroup: data.bloodGroup !== undefined ? data.bloodGroup : staff.bloodGroup,
                fatherSpouseName: data.fatherSpouseName !== undefined ? data.fatherSpouseName : staff.fatherSpouseName,
                permanentAddress: data.permanentAddress !== undefined ? data.permanentAddress : staff.permanentAddress,
                bankName: data.bankName !== undefined ? data.bankName : staff.bankName,
                bankBranch: data.bankBranch !== undefined ? data.bankBranch : staff.bankBranch,
                accNumber: data.accNumber !== undefined ? data.accNumber : staff.accNumber,
                ifscCode: data.ifscCode !== undefined ? data.ifscCode : staff.ifscCode,
                pfNumber: data.pfNumber !== undefined ? data.pfNumber : staff.pfNumber,
                esiNumber: data.esiNumber !== undefined ? data.esiNumber : staff.esiNumber,
                emergencyContactName: data.emergencyContactName !== undefined ? data.emergencyContactName : staff.emergencyContactName,
                emergencyContactPhone: data.emergencyContactPhone !== undefined ? data.emergencyContactPhone : staff.emergencyContactPhone,
                degrees: data.degrees !== undefined ? data.degrees : staff.degrees,
                skills: data.skills !== undefined ? data.skills : staff.skills,
                certifications: data.certifications !== undefined ? data.certifications : staff.certifications,
                subjectsExpertise: data.subjectsExpertise !== undefined ? data.subjectsExpertise : staff.subjectsExpertise,
            },
        });
    }
    async getLeaves(institutionId, staffId) {
        const where = {
            staff: { institutionId },
        };
        if (staffId) {
            where.staffId = staffId;
        }
        return this.prisma.leaveRequest.findMany({
            where,
            include: {
                staff: {
                    select: { firstName: true, lastName: true, designation: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLeaveRequest(staffUserId, data) {
        const staff = await this.prisma.staff.findUnique({
            where: { userId: staffUserId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff profile not found');
        }
        return this.prisma.leaveRequest.create({
            data: {
                staffId: staff.id,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
                status: 'PENDING',
            },
        });
    }
    async updateLeaveStatus(institutionId, leaveId, status, approverUserId) {
        const leave = await this.prisma.leaveRequest.findFirst({
            where: {
                id: leaveId,
                staff: { institutionId },
            },
        });
        if (!leave) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        return this.prisma.leaveRequest.update({
            where: { id: leaveId },
            data: {
                status,
                approvedById: approverUserId,
            },
        });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map