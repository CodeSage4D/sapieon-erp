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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getClassAttendance(institutionId, classId, dateStr) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        const students = await this.prisma.student.findMany({
            where: { classId, institutionId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                rollNumber: true,
            },
            orderBy: { rollNumber: 'asc' },
        });
        const attendanceRecords = await this.prisma.attendance.findMany({
            where: {
                date,
                student: { classId, institutionId },
            },
        });
        const recordsMap = new Map(attendanceRecords.map((r) => [r.studentId, r]));
        return students.map((student) => {
            const existing = recordsMap.get(student.id);
            return {
                studentId: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                rollNumber: student.rollNumber,
                status: existing ? existing.status : 'PRESENT',
                remarks: existing ? existing.remarks : '',
                attendanceId: existing ? existing.id : null,
            };
        });
    }
    async recordBulk(institutionId, staffUserId, data) {
        const date = new Date(data.date);
        date.setHours(0, 0, 0, 0);
        const staff = await this.prisma.staff.findFirst({
            where: { userId: staffUserId },
            select: { id: true },
        });
        const recordedById = staff ? staff.id : 'SYSTEM';
        const operations = data.records.map((record) => {
            return this.prisma.attendance.upsert({
                where: {
                    studentId_date: {
                        studentId: record.studentId,
                        date,
                    },
                },
                update: {
                    status: record.status,
                    remarks: record.remarks || '',
                    recordedById,
                },
                create: {
                    studentId: record.studentId,
                    date,
                    status: record.status,
                    remarks: record.remarks || '',
                    recordedById,
                },
            });
        });
        await this.prisma.$transaction(operations);
        return { success: true, count: data.records.length };
    }
    async getStudentSummary(studentId) {
        const records = await this.prisma.attendance.findMany({
            where: { studentId },
        });
        const total = records.length;
        const present = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
        const absent = records.filter((r) => r.status === 'ABSENT').length;
        const rate = total > 0 ? (present / total) * 100 : 100;
        return {
            total,
            present,
            absent,
            rate: Math.round(rate * 10) / 10,
            history: records.sort((a, b) => b.date.getTime() - a.date.getTime()),
        };
    }
    async getInstitutionOverview(institutionId) {
        const totalStudents = await this.prisma.student.count({ where: { institutionId } });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const records = await this.prisma.attendance.findMany({
            where: {
                date: { gte: sevenDaysAgo },
                student: { institutionId },
            },
        });
        const total = records.length;
        const present = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
        const rate = total > 0 ? (present / total) * 100 : 96.5;
        return {
            totalStudents,
            attendanceRate: Math.round(rate * 10) / 10,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map